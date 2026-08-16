const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('lab_orders').orderBy('created_at', 'desc').get();
    const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const patientIds = [...new Set(orders.map(o => String(o.patient_id)).filter(id => id && id !== 'null' && id !== 'undefined' && id.trim() !== ''))];
    const doctorIds = [...new Set(orders.map(o => String(o.doctor_id)).filter(id => id && id !== 'null' && id !== 'undefined' && id.trim() !== ''))];
    const consIds = [...new Set(orders.map(o => String(o.consultation_id)).filter(id => id && id !== 'null' && id !== 'undefined' && id.trim() !== ''))];

    const [patientsDocs, usersDocs, consDocs] = await Promise.all([
      patientIds.length > 0 ? Promise.all(patientIds.map(id => db.collection('patients').doc(id).get())) : Promise.resolve([]),
      doctorIds.length > 0 ? Promise.all(doctorIds.map(id => db.collection('users').doc(id).get())) : Promise.resolve([]),
      consIds.length > 0 ? Promise.all(consIds.map(id => db.collection('consultations').doc(id).get())) : Promise.resolve([])
    ]);

    const patientMap = {};
    patientsDocs.forEach(doc => {
      if (doc.exists) patientMap[doc.id] = doc.data().name || 'Unknown Patient';
    });

    const userMap = {};
    usersDocs.forEach(doc => {
      if (doc.exists) userMap[doc.id] = doc.data().name || 'Unknown Doctor';
    });

    const consMap = {};
    consDocs.forEach(doc => {
      if (doc.exists) consMap[doc.id] = doc.data();
    });

    const results = orders.map(l => {
      const pId = String(l.patient_id);
      const dId = String(l.doctor_id);
      const cId = String(l.consultation_id);
      const consData = consMap[cId] || {};

      return {
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
    const docRef = db.collection('lab_orders').doc(req.params.id);
    const orderDoc = await docRef.get();
    if (orderDoc.exists) {
      const orderData = orderDoc.data();
      const appId = orderData.appointment_id;

      await docRef.update({
        status,
        result,
        lab_scientist_id: String(req.user.id)
      });

      if (appId && status === 'Completed') {
        const pendingSnap = await db.collection('lab_orders')
          .where('appointment_id', '==', String(appId))
          .where('status', '==', 'Pending')
          .get();
        
        if (pendingSnap.empty) {
          await db.collection('appointments').doc(String(appId)).update({
            status: 'Lab Results Received'
          });
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
