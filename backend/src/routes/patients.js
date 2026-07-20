const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('patients').get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Client side might expect ordering by id (date), we'll let frontend or basic array sort handle it for now
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, phone, email, gender, dob, address } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const counterRef = db.collection('counters').doc('patients');
    
    const newId = await db.runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      let seq = 1;
      if (doc.exists) {
        seq = (doc.data().seq || 0) + 1;
      }
      t.set(counterRef, { seq: seq }, { merge: true });
      
      const formattedSeq = String(seq).padStart(4, '0');
      return `PT-${formattedSeq}`; // e.g., PT-0001
    });

    const newPatient = {
      name, phone, email, gender, dob, address,
      patient_id: newId,
      created_at: new Date().toISOString()
    };
    
    await db.collection('patients').doc(newId).set(newPatient);
    res.status(201).json({ id: newId, name, phone, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/history', async (req, res) => {
  const patientId = req.params.id;
  try {
    const history = {};
    
    const [cons, labs, rx, tx, nursing] = await Promise.all([
      db.collection('consultations').where('patient_id', '==', patientId).get(),
      db.collection('lab_orders').where('patient_id', '==', patientId).get(),
      db.collection('prescriptions').where('patient_id', '==', patientId).get(),
      db.collection('ordered_treatments').where('patient_id', '==', patientId).get(),
      db.collection('nursing_logs').where('patient_id', '==', patientId).get()
    ]);

    history.consultations = cons.docs.map(d => ({id: d.id, ...d.data()}));
    history.labs = labs.docs.map(d => ({id: d.id, ...d.data()}));
    history.prescriptions = rx.docs.map(d => ({id: d.id, ...d.data()}));
    history.treatments = tx.docs.map(d => ({id: d.id, ...d.data()}));
    history.nursing = nursing.docs.map(d => ({id: d.id, ...d.data()}));
    
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get Patient Timeline
router.get('/:id/timeline', async (req, res) => {
  try {
    const id = req.params.id;
    const timeline = [];

    // Appointments
    const appts = await db.collection('appointments').where('patient_id', '==', id).get();
    appts.forEach(d => timeline.push({ type: 'appointment', ...d.data(), id: d.id, sortDate: new Date(d.data().date + 'T' + (d.data().time || '00:00')) }));

    // Consultations
    const cons = await db.collection('consultations').where('patient_id', '==', id).get();
    cons.forEach(d => timeline.push({ type: 'consultation', ...d.data(), id: d.id, sortDate: new Date(d.data().created_at) }));

    // Prescriptions
    const rx = await db.collection('prescriptions').where('patient_id', '==', id).get();
    rx.forEach(d => timeline.push({ type: 'prescription', ...d.data(), id: d.id, sortDate: new Date(d.data().created_at) }));

    // Lab Orders
    const labs = await db.collection('lab_orders').where('patient_id', '==', id).get();
    labs.forEach(d => timeline.push({ type: 'lab_order', ...d.data(), id: d.id, sortDate: new Date(d.data().created_at) }));

    // Nursing Triage
    const triage = await db.collection('nursing_triage').where('patient_id', '==', id).get();
    triage.forEach(d => timeline.push({ type: 'triage', ...d.data(), id: d.id, sortDate: new Date(d.data().created_at) }));

    // Sort descending by date
    timeline.sort((a, b) => b.sortDate - a.sortDate);

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
