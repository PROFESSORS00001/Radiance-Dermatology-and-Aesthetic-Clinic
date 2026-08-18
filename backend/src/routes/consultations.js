const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { resolvePatientAndDoctorNames } = require('../resolver');
const { sendEmail } = require('../mailer');

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('consultations').orderBy('created_at', 'desc').get();
    const consultations = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const results = await resolvePatientAndDoctorNames(consultations, 'patient_id', 'doctor_id');
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
      created_at: new Date().toISOString(),
      visit_type: payload.visit_type || null,
      referred_by: payload.referred_by || null,
      history_of_presenting_complaint: payload.history_of_presenting_complaint || null,
      past_history_json: payload.past_history_json || null,
      drug_history_json: payload.drug_history_json || null,
      morphology_json: payload.morphology_json || null,
      distribution_json: payload.distribution_json || null,
      site_affected: payload.site_affected || null,
      additional_findings: payload.additional_findings || null,
      body_map_data_json: payload.body_map_data_json || null,
      differential_diagnosis: payload.differential_diagnosis || null,
      investigations_ordered_json: payload.investigations_ordered_json || null,
      patient_education: payload.patient_education || null,
      next_appointment_type: payload.next_appointment_type || null,
      next_appointment_date: payload.next_appointment_date || null
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
          appointment_id: String(payload.appointment_id || ''),
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
      try {
        await db.collection('draft_consultations').doc(String(payload.appointment_id)).delete();
      } catch (err) {}
    }
    
    // Send email to patient
    try {
      const patDoc = await db.collection('patients').doc(String(payload.patient_id)).get();
      if (patDoc.exists) {
        const pat = patDoc.data();
        if (pat.email) {
          const emailHtml = `
            <h2>Consultation Completed</h2>
            <p>Dear ${pat.name},</p>
            <p>Your consultation with the doctor has been completed. Your medical records, prescriptions, and invoice have been updated in your file.</p>
            <p>If you have any pending payments or prescriptions to collect, please visit the Reception/Pharmacy.</p>
            <br>
            <p>Thank you,</p>
            <p><strong>Radiance Dermatology Clinic</strong></p>
          `;
          await sendEmail(pat.email, 'Consultation Completed - Radiance Clinic', emailHtml);
        }
      }
    } catch (e) {
      console.error("Failed to send consultation complete email:", e);
    }

    res.status(201).json({ id: consultation_id, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process consultation workflow' });
  }
});

router.post('/lab_orders_draft', async (req, res) => {
  const payload = req.body;
  if (!payload.appointment_id || !payload.patient_id) {
    return res.status(400).json({ error: 'appointment_id and patient_id required' });
  }

  try {
    await db.collection('draft_consultations').doc(String(payload.appointment_id)).set({
      appointment_id: String(payload.appointment_id),
      patient_id: String(payload.patient_id),
      doctor_id: String(payload.doctor_id || ''),
      age_group: payload.age_group || null,
      gender: payload.gender || null,
      residence_type: payload.residence_type || null,
      primary_complaint: payload.primary_complaint || null,
      working_diagnosis: payload.working_diagnosis || null,
      doctor_notes: payload.doctor_notes || null,
      visit_type: payload.visit_type || null,
      referred_by: payload.referred_by || null,
      history_of_presenting_complaint: payload.history_of_presenting_complaint || null,
      past_history_json: payload.past_history_json || null,
      drug_history_json: payload.drug_history_json || null,
      morphology_json: payload.morphology_json || null,
      distribution_json: payload.distribution_json || null,
      site_affected: payload.site_affected || null,
      additional_findings: payload.additional_findings || null,
      body_map_data_json: payload.body_map_data_json || null,
      differential_diagnosis: payload.differential_diagnosis || null,
      investigations_ordered_json: payload.investigations_ordered_json || null,
      patient_education: payload.patient_education || null,
      next_appointment_type: payload.next_appointment_type || null,
      next_appointment_date: payload.next_appointment_date || null,
      updated_at: new Date().toISOString()
    });

    let totalAmount = 0;
    const billItems = [];
    if (Array.isArray(payload.lab_orders)) {
      for (let lab of payload.lab_orders) {
        await db.collection('lab_orders').add({
          appointment_id: String(payload.appointment_id),
          patient_id: String(payload.patient_id),
          doctor_id: String(payload.doctor_id || ''),
          test_name: lab.test_name,
          price: parseFloat(lab.price) || 0,
          status: 'Pending',
          result: '',
          created_at: new Date().toISOString()
        });
        totalAmount += parseFloat(lab.price) || 0;
        billItems.push({ name: lab.test_name, type: 'Lab Test', cost: parseFloat(lab.price) || 0 });
      }
    }

    if (totalAmount > 0) {
      await db.collection('billing').add({
        appointment_id: String(payload.appointment_id),
        patient_id: String(payload.patient_id),
        items_json: JSON.stringify(billItems),
        total_amount: totalAmount,
        status: 'Unpaid',
        created_at: new Date().toISOString()
      });
    }

    await db.collection('appointments').doc(String(payload.appointment_id)).update({
      status: 'Awaiting Lab Results'
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/draft/:appId', async (req, res) => {
  try {
    const doc = await db.collection('draft_consultations').doc(String(req.params.appId)).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/results/:appId', async (req, res) => {
  try {
    const snap = await db.collection('lab_orders')
      .where('appointment_id', '==', String(req.params.appId))
      .get();
    res.json(snap.docs.map(d => d.data()));
  } catch (err) {
    res.status(500).json({ error: err.message });
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
