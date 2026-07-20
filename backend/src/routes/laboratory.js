const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('lab_orders').orderBy('created_at', 'desc').get();
    
    const results = [];
    const patientCache = {};
    const userCache = {};
    const consCache = {};

    for (let doc of snap.docs) {
      const l = doc.data();
      const pId = String(l.patient_id);
      const dId = String(l.doctor_id);
      const cId = String(l.consultation_id);

      let pName = 'Unknown Patient';
      if (pId && pId !== 'undefined') {
        if (!patientCache[pId]) {
          const pat = await db.collection('patients').doc(pId).get();
          patientCache[pId] = pat.exists ? pat.data().name : 'Unknown Patient';
        }
        pName = patientCache[pId];
      }

      let dName = 'Unknown Doctor';
      if (dId && dId !== 'undefined') {
        if (!userCache[dId]) {
          const docRes = await db.collection('users').doc(dId).get();
          userCache[dId] = docRes.exists ? docRes.data().name : 'Unknown Doctor';
        }
        dName = userCache[dId];
      }

      let working_diagnosis = '';
      let presenting_complaints_json = '[]';
      if (cId && cId !== 'undefined') {
        if (!consCache[cId]) {
          const consRes = await db.collection('consultations').doc(cId).get();
          consCache[cId] = consRes.exists ? consRes.data() : null;
        }
        if (consCache[cId]) {
          working_diagnosis = consCache[cId].working_diagnosis;
          presenting_complaints_json = consCache[cId].presenting_complaints_json;
        }
      }

      results.push({
        id: doc.id,
        ...l,
        patient_name: pName,
        doctor_name: dName,
        working_diagnosis,
        presenting_complaints_json
      });
    }

    // Sort by status descending in memory (so 'Pending' is often above 'Completed')
    results.sort((a, b) => b.status.localeCompare(a.status));

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
