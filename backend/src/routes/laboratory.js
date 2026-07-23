const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const [snap, patientsSnap, usersSnap, consSnap] = await Promise.all([
      db.collection('lab_orders').orderBy('created_at', 'desc').get(),
      db.collection('patients').get(),
      db.collection('users').get(),
      db.collection('consultations').get()
    ]);

    const patientMap = {};
    patientsSnap.docs.forEach(doc => {
      patientMap[doc.id] = doc.data().name || 'Unknown Patient';
    });

    const userMap = {};
    usersSnap.docs.forEach(doc => {
      userMap[doc.id] = doc.data().name || 'Unknown Doctor';
    });

    const consMap = {};
    consSnap.docs.forEach(doc => {
      consMap[doc.id] = doc.data();
    });

    const results = snap.docs.map(doc => {
      const l = doc.data();
      const pId = String(l.patient_id);
      const dId = String(l.doctor_id);
      const cId = String(l.consultation_id);

      const consData = consMap[cId] || {};

      return {
        id: doc.id,
        ...l,
        patient_name: patientMap[pId] || 'Unknown Patient',
        doctor_name: userMap[dId] || 'Unknown Doctor',
        working_diagnosis: consData.working_diagnosis || '',
        presenting_complaints_json: consData.presenting_complaints_json || '[]'
      };
    });

    // Sort by status descending in memory (so 'Pending' is often above 'Completed')
    results.sort((a, b) => (b.status || '').localeCompare(a.status || ''));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { status, result } = req.body;
  try {
    await db.collection('lab_orders').doc(req.params.id).update({
      status,
      result,
      lab_scientist_id: String(req.user.id)
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
