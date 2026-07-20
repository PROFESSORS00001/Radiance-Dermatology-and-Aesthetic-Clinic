const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('consultations').orderBy('created_at', 'desc').get();
    
    const results = [];
    const patientCache = {};
    const userCache = {};

    for (let doc of snap.docs) {
      const c = doc.data();
      const pId = String(c.patient_id);
      const dId = String(c.doctor_id);

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
        ...c,
        patient_name: pName,
        doctor_name: dName
      });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const payload = req.body;
  if (!payload.patient_id || !payload.doctor_id) {
    return res.status(400).json({ error: 'patient_id and doctor_id required' });
  }

  try {
    const consultationData = {
      appointment_id: String(payload.appointment_id || ''),
      doctor_id: String(payload.doctor_id),
      patient_id: String(payload.patient_id),
      date: payload.date || new Date().toISOString().split('T')[0],
      age_group: payload.age_group || null,
      gender: payload.gender || null,
      residence_type: payload.residence_type || null,
      presenting_complaints_json: JSON.stringify(payload.presenting_complaints || []),
      primary_complaint: payload.primary_complaint || null,
      illness_duration: payload.illness_duration || null,
      illness_history_type: payload.illness_history_type || null,
      working_diagnosis: payload.working_diagnosis || null,
      diagnostic_confidence: payload.diagnostic_confidence || null,
      disease_category: payload.disease_category || null,
      severity: payload.severity || null,
      treatment_given_json: JSON.stringify(payload.treatment_given || []),
      follow_up_needed: payload.follow_up_needed || null,
      follow_up_interval: payload.follow_up_interval || null,
      created_at: new Date().toISOString()
    };
    
    const consRef = await db.collection('consultations').add(consultationData);
    const consultation_id = consRef.id;

    // Get dynamic consultation fee
    const feeDoc = await db.collection('settings').doc('consultation_fee').get();
    let totalAmount = feeDoc.exists ? parseFloat(feeDoc.data().value) : 150000;
    const billItems = [];
    
    if (totalAmount > 0) {
      billItems.push({ name: 'Consultation Fee', type: 'Consultation', cost: totalAmount });
    }

    // Insert Lab Orders
    if (Array.isArray(payload.lab_orders)) {
      for (let lab of payload.lab_orders) {
        await db.collection('lab_orders').add({
          consultation_id,
          patient_id: String(payload.patient_id),
          doctor_id: String(payload.doctor_id),
          test_name: lab.test_name,
          price: parseFloat(lab.price) || 0,
          status: 'Pending',
          created_at: new Date().toISOString()
        });
        totalAmount += parseFloat(lab.price) || 0;
        billItems.push({ name: lab.test_name, type: 'Lab Test', cost: parseFloat(lab.price) || 0 });
      }
    }

    // Insert Prescriptions
    if (Array.isArray(payload.prescriptions)) {
      for (let rx of payload.prescriptions) {
        await db.collection('prescriptions').add({
          consultation_id,
          patient_id: String(payload.patient_id),
          doctor_id: String(payload.doctor_id),
          drug_name: rx.drug_name,
          frequency: rx.frequency,
          route: rx.route,
          duration: rx.duration,
          instructions: rx.instructions,
          price: parseFloat(rx.price) || 0,
          status: 'Pending',
          is_paid: 0,
          created_at: new Date().toISOString()
        });
        totalAmount += parseFloat(rx.price) || 0;
        billItems.push({ name: rx.drug_name, type: 'Medication', cost: parseFloat(rx.price) || 0 });
      }
    }

    // Insert Clinical Treatments
    if (Array.isArray(payload.clinical_treatments)) {
      for (let tx of payload.clinical_treatments) {
        await db.collection('ordered_treatments').add({
          consultation_id,
          patient_id: String(payload.patient_id),
          doctor_id: String(payload.doctor_id),
          treatment_name: tx.treatment_name,
          price: parseFloat(tx.price) || 0,
          status: 'Pending',
          created_at: new Date().toISOString()
        });
        totalAmount += parseFloat(tx.price) || 0;
        billItems.push({ name: tx.treatment_name, type: 'Treatment', cost: parseFloat(tx.price) || 0 });
      }
    }

    // Create Unified Bill for today
    if (totalAmount > 0) {
      await db.collection('billing').add({
        consultation_id,
        patient_id: String(payload.patient_id),
        items_json: JSON.stringify(billItems),
        total_amount: totalAmount,
        status: 'Unpaid',
        created_at: new Date().toISOString()
      });
    }
    
    if (payload.appointment_id) {
      await db.collection('appointments').doc(String(payload.appointment_id)).update({ status: 'Completed' });
    }

    res.status(201).json({ id: consultation_id, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process consultation workflow' });
  }
});

// Settings & Catalogs specific getters for Doctor form
router.get('/lab_catalog', async (req, res) => {
  try {
    const snap = await db.collection('lab_catalog').get();
    res.json(snap.docs.map(d => ({id: d.id, ...d.data()})));
  } catch(e) { res.status(500).json({error:e.message}); }
});

router.get('/pharmacy_inventory', async (req, res) => {
  try {
    const snap = await db.collection('pharmacy_inventory').get();
    res.json(snap.docs.map(d => ({id: d.id, ...d.data()})));
  } catch(e) { res.status(500).json({error:e.message}); }
});

router.get('/treatment_catalog', async (req, res) => {
  try {
    const snap = await db.collection('treatment_catalog').get();
    res.json(snap.docs.map(d => ({id: d.id, ...d.data()})));
  } catch(e) { res.status(500).json({error:e.message}); }
});

module.exports = router;
