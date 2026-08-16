const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { sendEmail } = require('../mailer');
const { resolvePatientAndDoctorNames } = require('../resolver');

router.get('/', async (req, res) => {
  try {
    const appsSnap = await db.collection('appointments').orderBy('date', 'asc').get();
    const apps = appsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const results = await resolvePatientAndDoctorNames(apps, 'patient_id', 'doctor_id');
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
              let pdfBuffer = null;
              try {
                const { generatePdfBuffer } = require('../pdfService');
                pdfBuffer = await generatePdfBuffer(htmlString);
              } catch (pdfErr) {
                console.error("PDF generation failed, falling back to plain email confirmation:", pdfErr);
              }

              const nodemailer = require('nodemailer');
              const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT) || 465,
                secure: parseInt(process.env.SMTP_PORT) === 465,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              });

              const mailOptions = {
                from: `"${process.env.SMTP_FROM_NAME || 'Radiance Derms'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to: recipientEmail,
                subject: 'Appointment Booking Confirmation',
                html: `<h3>Hello ${recipientName},</h3><p>Your appointment for <b>${purpose}</b> is scheduled for <b>${date} at ${time}</b>.</p>${pdfBuffer ? '<p>Please find your official booking receipt attached.</p>' : '<p>Your payment has been successfully recorded. Thank you for choosing Radiance Derms.</p>'}`
              };

              if (pdfBuffer) {
                mailOptions.attachments = [{ filename: 'booking_receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }];
              } else if (htmlString) {
                mailOptions.html += `<div style="margin-top:2rem; padding:1.5rem; border:1px solid #cbd5e1; border-radius:8px; background:#fafafa;">${htmlString}</div>`;
                mailOptions.html += `<p style="color:#64748b; font-size:12px; margin-top:2rem; border-top:1px dashed #cbd5e1; padding-top:1rem;">Note: This receipt could not be rendered as a PDF attachment on your system, so the details have been displayed directly in the email body above.</p>`;
              }

              await transporter.sendMail(mailOptions);
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

router.patch('/:id/verify_payment', async (req, res) => {
  try {
    const appRef = db.collection('appointments').doc(req.params.id);
    const appDoc = await appRef.get();
    if (!appDoc.exists) return res.status(404).json({ error: 'Appointment not found' });

    const appData = appDoc.data();
    await appRef.update({ payment_status: 'Verified', status: 'Approved' });
    res.json({ success: true });

    (async () => {
       const patDoc = await db.collection('patients').doc(appData.patient_id).get();
       const patEmail = patDoc.exists ? patDoc.data().email : null;
       
       if (patEmail) {
         const { sendEmail } = require('../mailer');
         const snap = await db.collection('settings').get();
         let clinicName = 'Radiance Dermatology Clinic';
         snap.docs.forEach(d => {
           if (d.id === 'clinic_name') clinicName = d.data().value;
         });
         
         const html = `
           <h3>Hello ${appData.patient_name},</h3>
           <p>Your Orange Money payment (Transaction ID: ${appData.orange_money_transaction_id}) has been successfully <b>Verified</b>.</p>
           <p>Your appointment for <b>${appData.purpose}</b> is now confirmed for <b>${appData.date} at ${appData.time}</b> at ${clinicName}.</p>
           <p>We look forward to seeing you!</p>
           <br><p>The Clinic Team</p>
         `;
         await sendEmail(patEmail, `Payment Verified & Appointment Confirmed`, html);
       }
    })().catch(err => console.error('Email error in verify payment:', err));
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status, patientEmail, htmlString, new_date, new_time } = req.body;
  
  try {
    const appRef = db.collection('appointments').doc(req.params.id);
    const appDoc = await appRef.get();
    if (!appDoc.exists) return res.status(404).json({ error: 'Appointment not found' });

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
            let pdfBuffer = null;
            try {
              const { generatePdfBuffer } = require('../pdfService');
              pdfBuffer = await generatePdfBuffer(htmlString);
            } catch (pdfErr) {
              console.error("PDF status email generation failed, falling back to plain email:", pdfErr);
            }

            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: parseInt(process.env.SMTP_PORT) || 465,
              secure: parseInt(process.env.SMTP_PORT) === 465,
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });

            const mailOptions = {
              from: `"${process.env.SMTP_FROM_NAME || 'Radiance Derms'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
              to: targetEmail,
              subject: `Appointment ${status} Receipt`,
              html: `<p>Your appointment has been ${status}. ${pdfBuffer ? 'Please find your receipt attached.' : 'Thank you for choosing Radiance Derms.'}</p>`
            };

            if (pdfBuffer) {
              mailOptions.attachments = [{ filename: 'booking_receipt.pdf', content: pdfBuffer, contentType: 'application/pdf' }];
            } else if (htmlString) {
              mailOptions.html += `<div style="margin-top:2rem; padding:1.5rem; border:1px solid #cbd5e1; border-radius:8px; background:#fafafa;">${htmlString}</div>`;
              mailOptions.html += `<p style="color:#64748b; font-size:12px; margin-top:2rem; border-top:1px dashed #cbd5e1; padding-top:1rem;">Note: This receipt could not be rendered as a PDF attachment on your system, so the details have been displayed directly in the email body above.</p>`;
            }

            await transporter.sendMail(mailOptions);
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
