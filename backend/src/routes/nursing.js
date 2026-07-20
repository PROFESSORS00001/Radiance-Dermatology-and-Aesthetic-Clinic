const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/treatments', async (req, res) => {
  try {
    const snap = await db.collection('ordered_treatments').where('status', '==', 'Pending').get();
    const results = [];
    const patientCache = {};
    const userCache = {};

    for (let doc of snap.docs) {
      const t = doc.data();
      const pId = String(t.patient_id);
      const dId = String(t.doctor_id);

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

      results.push({
        id: doc.id,
        ...t,
        patient_name: pName,
        doctor_name: dName
      });
    }

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
    const snap = await db.collection('nursing_logs').where('patient_id', '==', String(req.params.patient_id)).get();
    const results = [];
    const userCache = {};

    for (let doc of snap.docs) {
      const n = doc.data();
      const nId = String(n.nurse_id);

      let nurse_name = 'Unknown Nurse';
      if (nId && nId !== 'undefined') {
        if (!userCache[nId]) {
          const docRes = await db.collection('users').doc(nId).get();
          userCache[nId] = docRes.exists ? docRes.data().name : 'Unknown Nurse';
        }
        nurse_name = userCache[nId];
      }

      results.push({
        id: doc.id,
        ...n,
        nurse_name
      });
    }

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
