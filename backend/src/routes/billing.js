const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { resolvePatientAndDoctorNames } = require('../resolver');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('billing').orderBy('created_at', 'desc').get();
    const bills = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const results = await resolvePatientAndDoctorNames(bills, 'patient_id', null);
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
