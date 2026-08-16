const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { resolvePatientAndDoctorNames } = require('../resolver');

router.get('/treatments', async (req, res) => {
  try {
    const snap = await db.collection('ordered_treatments').where('status', '==', 'Pending').get();
    const treatments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const results = await resolvePatientAndDoctorNames(treatments, 'patient_id', 'doctor_id');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/treatments/:id', async (req, res) => {
  try {
    await db.collection('ordered_treatments').doc(req.params.id).update({
      status: 'Administered',
      nurse_id: String(req.user.id)
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/logs/:patient_id', async (req, res) => {
  try {
    const [snap, usersSnap] = await Promise.all([
      db.collection('nursing_logs').where('patient_id', '==', String(req.params.patient_id)).get(),
      db.collection('users').get()
    ]);

    const userMap = {};
    usersSnap.docs.forEach(doc => {
      userMap[doc.id] = doc.data().name || 'Unknown Nurse';
    });

    const results = snap.docs.map(doc => {
      const n = doc.data();
      const nId = String(n.nurse_id);
      return {
        id: doc.id,
        ...n,
        nurse_name: userMap[nId] || 'Unknown Nurse'
      };
    });

    // Sort descending by created_at in memory
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(results);
  } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/logs', async (req, res) => {
  const { patient_id, vitals_json, notes } = req.body;
  try {
    const docRef = await db.collection('nursing_logs').add({
      patient_id: String(patient_id),
      nurse_id: String(req.user.id),
      vitals_json: JSON.stringify(vitals_json),
      notes,
      created_at: new Date().toISOString()
    });
    res.json({ id: docRef.id, success:true });
  } catch(err) { res.status(500).json({error: err.message}); }
});

module.exports = router;
