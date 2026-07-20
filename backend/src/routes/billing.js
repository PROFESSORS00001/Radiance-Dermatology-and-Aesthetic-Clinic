const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('billing').orderBy('created_at', 'desc').get();
    const results = [];
    const patientCache = {};

    for (let doc of snap.docs) {
      const b = doc.data();
      const pId = String(b.patient_id);

      let pName = 'Unknown Patient';
      if (pId && pId !== 'undefined') {
        if (!patientCache[pId]) {
          const pat = await db.collection('patients').doc(pId).get();
          patientCache[pId] = pat.exists ? pat.data().name : 'Unknown Patient';
        }
        pName = patientCache[pId];
      }

      results.push({
        id: doc.id,
        ...b,
        patient_name: pName
      });
    }

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
