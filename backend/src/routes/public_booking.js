const express = require('express');
const router = express.Router();
const db = require('../firebase');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendReceipt(email, name, date, time, purpose, transaction_id) {
  if (!email) return;
  try {
    const snap = await db.collection('settings').get();
    let emailSettings = {};
    snap.docs.forEach(d => {
      if (['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'clinic_name'].includes(d.id)) {
        emailSettings[d.id] = d.data().value;
      }
    });
    
    if (!emailSettings.smtp_user || !emailSettings.smtp_pass) return;

    let transporter = nodemailer.createTransport({
      host: emailSettings.smtp_host || 'smtp.gmail.com',
      port: parseInt(emailSettings.smtp_port) || 465,
      secure: true,
      auth: {
        user: emailSettings.smtp_user,
        pass: emailSettings.smtp_pass
      }
    });

    let html = `
      <h3>Hello ${name},</h3>
      <p>Thank you for choosing ${emailSettings.clinic_name || 'Radiance Dermatology Clinic'}.</p>
      <p>Your appointment request for <b>${purpose}</b> on <b>${date} at ${time}</b> has been received.</p>
      <p>Orange Money Transaction ID: <b>${transaction_id}</b></p>
      <p>Your booking is currently <b>Pending Verification</b>. You will receive another email once your payment is confirmed and the appointment is officially scheduled.</p>
      <br>
      <p>Best Regards,</p>
      <p>The Clinic Team</p>
    `;

    await transporter.sendMail({
      from: `"${emailSettings.clinic_name || 'Clinic'}" <${emailSettings.smtp_user}>`,
      to: email,
      subject: `Booking Request Received - ${date}`,
      html: html
    });
  } catch (err) {
    console.error('Email sending failed in public booking:', err);
  }
}

router.get('/availability', async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).json({ error: 'Date is required' });
  try {
    const snap = await db.collection('settings').get();
    let settings = {};
    snap.docs.forEach(d => { settings[d.id] = d.data().value; });

    const start = settings.working_hours_start || '09:00';
    const end = settings.working_hours_end || '17:00';
    const duration = parseInt(settings.slot_duration) || 30;
    const closedDaysStr = settings.closed_days || 'Sunday';
    const closedDays = closedDaysStr.split(',').map(d => d.trim().toLowerCase());

    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    if (closedDays.includes(dayName)) {
      return res.json({ available_slots: [] });
    }

    const appts = await db.collection('appointments').where('date', '==', date).get();
    const bookedTimes = appts.docs.map(d => d.data().time);

    let slots = [];
    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (current < endTime) {
      let timeStr = current.toTimeString().substring(0, 5);
      if (!bookedTimes.includes(timeStr)) {
        slots.push(timeStr);
      }
      current.setMinutes(current.getMinutes() + duration);
    }
    res.json({ available_slots: slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, phone, email, date, time, purpose, transaction_id } = req.body;
  if (!name || !phone || !date || !time || !transaction_id) {
    return res.status(400).json({ error: 'Name, phone, date, time, and transaction ID are required' });
  }

  try {
    let patientId = null;
    const patientsRef = db.collection('patients');
    
    const phoneCheck = await patientsRef.where('phone', '==', phone).get();
    if (!phoneCheck.empty) {
      const matched = phoneCheck.docs.find(d => d.data().name.toLowerCase() === name.toLowerCase());
      if (matched) patientId = matched.id;
    }
    
    if (!patientId && email) {
      const emailCheck = await patientsRef.where('email', '==', email).get();
      if (!emailCheck.empty) {
        const matched = emailCheck.docs.find(d => d.data().name.toLowerCase() === name.toLowerCase());
        if (matched) patientId = matched.id;
      }
    }

    if (!patientId) {
      const counterRef = db.collection('counters').doc('patients');
      patientId = await db.runTransaction(async (t) => {
        const doc = await t.get(counterRef);
        let seq = 1;
        if (doc.exists) seq = (doc.data().seq || 0) + 1;
        t.set(counterRef, { seq: seq }, { merge: true });
        return `PT-${String(seq).padStart(4, '0')}`;
      });

      await patientsRef.doc(patientId).set({
        name, phone, email: email || '', gender: 'Unknown', dob: '', address: '',
        patient_id: patientId,
        created_at: new Date().toISOString()
      });
    }

    const existingAppts = await db.collection('appointments').where('patient_id', '==', patientId).get();
    const hasPending = existingAppts.docs.some(d => {
      const data = d.data();
      return data.status === 'Pending' || data.payment_status === 'Pending Verification';
    });
    
    if (hasPending) {
      return res.status(400).json({ error: 'You already have a pending booking. Please wait for confirmation before booking another.' });
    }
    const newApp = {
      patient_id: patientId,
      patient_name: name,
      patient_phone: phone,
      date,
      time,
      purpose: purpose || 'Consultation',
      status: 'Pending',
      payment_status: 'Pending Verification',
      orange_money_transaction_id: transaction_id,
      created_at: new Date().toISOString()
    };
    
    await db.collection('appointments').add(newApp);
    
    sendReceipt(email, name, date, time, purpose || 'Consultation', transaction_id);

    res.status(201).json({ success: true, message: 'Booking received successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
