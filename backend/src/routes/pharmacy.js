const express = require('express');
const router = express.Router();
const db = require('../firebase');
const { sendEmail } = require('../mailer');
const { resolvePatientAndDoctorNames } = require('../resolver');

router.get('/prescriptions', async (req, res) => {
  try {
    const snap = await db.collection('prescriptions').orderBy('created_at', 'desc').get();
    const prescriptions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const results = await resolvePatientAndDoctorNames(prescriptions, 'patient_id', 'doctor_id');

    // Sort by status descending in memory (so 'Pending' is often above 'Completed')
    results.sort((a, b) => (b.status || '').localeCompare(a.status || ''));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/prescriptions/:id', async (req, res) => {
    const { status, is_paid } = req.body;
    try {
      const rxRef = db.collection('prescriptions').doc(req.params.id);
      await rxRef.update({
        status,
        is_paid: is_paid ? 1 : 0,
        dispensed_by: String(req.user.id)
      });
      
      if (is_paid) {
        const rxDoc = await rxRef.get();
        if (rxDoc.exists) {
          const rxData = rxDoc.data();
          
          // Decrement stock
          if (status === 'Dispensed') {
            const inventorySnap = await db.collection('pharmacy_inventory').where('drug_name', '==', rxData.drug_name).limit(1).get();
            if (!inventorySnap.empty) {
              const itemRef = inventorySnap.docs[0].ref;
              const currentStock = inventorySnap.docs[0].data().stock || 0;
              await itemRef.update({ stock: currentStock - 1 });
            }
          }

          // Send email
          const patDoc = await db.collection('patients').doc(String(rxData.patient_id)).get();
          if (patDoc.exists && patDoc.data().email) {
            sendEmail(patDoc.data().email, 'Pharmacy Receipt', `<h3>Hello ${patDoc.data().name},</h3><p>Your medication <b>${rxData.drug_name}</b> has been paid for and dispensed.</p><p>Cost: Le ${rxData.price}</p>`);
          }
        }
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
