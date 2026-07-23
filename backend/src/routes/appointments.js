const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { sendEmail } = require('../mailer');

router.get('/', async (req, res) => {
  try {
    // Parallelize fetching appointments, patients, and users to eliminate N+1 roundtrips
    const [appsSnap, patientsSnap, usersSnap] = await Promise.all([
      db.collection('appointments').orderBy('date', 'asc').get(),
      db.collection('patients').get(),
      db.collection('users').get()
    ]);

    // Build fast in-memory lookup maps
    const patientMap = {};
    patientsSnap.docs.forEach(doc => {
      patientMap[doc.id] = doc.data().name || 'Unknown Patient';
    });

    const userMap = {};
    usersSnap.docs.forEach(doc => {
      userMap[doc.id] = doc.data().name || 'Unknown Doctor';
    });

    const results = appsSnap.docs.map(doc => {
      const a = doc.data();
      const pId = String(a.patient_id);
      const dId = String(a.doctor_id);

      return {
        id: doc.id,
        ...a,
        patient_name: patientMap[pId] || 'Unknown Patient',
        doctor_name: userMap[dId] || 'Unknown Doctor'
      };
    });

    res.json(results);
  } catch (err) {
    console.error("GET appointments error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { patient_id, doctor_id, purpose, date, time, booking_fee, htmlString } = req.body;
  
  try {
    const newApp = {
      patient_id: String(patient_id),
      doctor_id: String(doctor_id),
      purpose,
      date,
      time,
      status: 'Scheduled',
      booking_fee: Number(booking_fee) || 0,
      paid: 1,
      created_at: new Date().toISOString()
    };
    
    const docRef = await db.collection('appointments').add(newApp);
    
    // IMMEDIATELY respond to frontend so the UI doesn't hang!
    res.status(201).json({ id: docRef.id, success: true });

    // Handle PDF generation and email asynchronously in background
    if (patient_id) {
      (async () => {
        try {
          const pat = await db.collection('patients').doc(String(patient_id)).get();
          if (pat.exists && pat.data().email) {
            const recipientEmail = pat.data().email;
            const recipientName = pat.data().name || 'Patient';

            if (htmlString) {
              const { generatePdfBuffer } = require('../pdfService');
              const pdfBuffer = await generatePdfBuffer(htmlString);
              const nodemailer = require('nodemailer');
              const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT) || 465,
                secure: parseInt(process.env.SMTP_PORT) === 465,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              });
              await transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME || 'Radiance Derms'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to: recipientEmail,
                subject: 'Appointment Booking Confirmation',
                html: `<h3>Hello ${recipientName},</h3><p>Your appointment for <b>${purpose}</b> is scheduled for <b>${date} at ${time}</b>.</p><p>Please find your official booking receipt attached.</p>`,
                attachments: [{ filename: 'booking_receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }]
              });
            } else {
              sendEmail(
                recipientEmail, 
                'Appointment Booking Confirmation', 
                `<h3>Hello ${recipientName},</h3><p>Your appointment for <b>${purpose}</b> is scheduled for <b>${date} at ${time}</b>.</p>`
              );
            }
          }
        } catch (bgErr) {
          console.error("Background appointment email error:", bgErr);
        }
      })();
    }
  } catch (err) {
    console.error("POST appointments error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, htmlString, patientEmail, new_date, new_time } = req.body;
    
    const appRef = db.collection('appointments').doc(req.params.id);
    const appDoc = await appRef.get();
    
    if (!appDoc.exists) return res.status(404).json({error: 'Appointment not found'});
    const appData = appDoc.data();
    
    const updateData = { status };
    if (new_date) updateData.date = new_date;
    if (new_time) updateData.time = new_time;
    
    await appRef.update(updateData);

    // Respond immediately to UI
    res.json({ success: true });
    
    // Background email processing
    (async () => {
      try {
        let targetEmail = patientEmail;
        let patName = 'Patient';
        if (!targetEmail && appData.patient_id) {
          const patDoc = await db.collection('patients').doc(String(appData.patient_id)).get();
          if (patDoc.exists) {
            targetEmail = patDoc.data().email;
            patName = patDoc.data().name || 'Patient';
          }
        }
        
        if (targetEmail) {
          if (htmlString) {
            const nodemailer = require('nodemailer');
            const { generatePdfBuffer } = require('../pdfService');
            const pdfBuffer = await generatePdfBuffer(htmlString);
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: parseInt(process.env.SMTP_PORT) || 465,
              secure: parseInt(process.env.SMTP_PORT) === 465,
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
            await transporter.sendMail({
              from: `"${process.env.SMTP_FROM_NAME || 'Radiance Derms'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
              to: targetEmail,
              subject: `Appointment ${status} Receipt`,
              html: `<p>Your appointment has been ${status}. Please find your receipt attached.</p>`,
              attachments: [{ filename: 'booking_receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }]
            });
          } else {
            let subj = `Appointment ${status} Notification`;
            let actualDate = new_date || appData.date;
            let actualTime = new_time || appData.time;
            let msg = `<h3>Hello ${patName},</h3><p>Your appointment has been officially <b>${status}</b>.</p><p>It is currently set for <b>${actualDate}</b> at <b>${actualTime}</b>.</p><p>Thank you!</p>`;
            sendEmail(targetEmail, subj, msg).catch(err => console.error("Plain Email err", err));
          }
        }
      } catch (bgErr) {
        console.error("Background status update email error:", bgErr);
      }
    })();
  } catch (err) {
    console.error("Status update error", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
