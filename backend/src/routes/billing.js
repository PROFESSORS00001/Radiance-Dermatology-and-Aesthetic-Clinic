const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const [snap, patientsSnap] = await Promise.all([
      db.collection('billing').orderBy('created_at', 'desc').get(),
      db.collection('patients').get()
    ]);

    const patientMap = {};
    patientsSnap.docs.forEach(doc => {
      patientMap[doc.id] = doc.data().name || 'Unknown Patient';
    });

    const results = snap.docs.map(doc => {
      const b = doc.data();
      const pId = String(b.patient_id);
      return {
        id: doc.id,
        ...b,
        patient_name: patientMap[pId] || 'Unknown Patient'
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    await db.collection('billing').doc(req.params.id).update({ status: req.body.status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
