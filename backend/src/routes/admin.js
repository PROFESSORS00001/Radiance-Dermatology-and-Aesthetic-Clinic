const express = require('express');
const router = express.Router();

router.get('/catalog/:table', async (req, res) => {
  const { table } = req.params;
  const allowedTables = ['lab_catalog', 'pharmacy_inventory', 'treatment_catalog'];
  if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
  try {
    const snap = await db.collection(table).get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

const db = require('../firebase');
const bcrypt = require('bcryptjs');

router.patch('/catalog/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const { price, stock } = req.body;
    const allowedTables = ['lab_catalog', 'pharmacy_inventory', 'treatment_catalog'];
    
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table' });
    }
  
    try {
      const updateData = { price: Number(price) };
      if (table === 'pharmacy_inventory' && stock !== undefined && stock !== null) {
        updateData.stock = Number(stock);
      }
      await db.collection(table).doc(id).update(updateData);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.post('/catalog/:table', async (req, res) => {
    const { table } = req.params;
    const { name, price, stock } = req.body;
    const allowedTables = ['lab_catalog', 'pharmacy_inventory', 'treatment_catalog'];
    
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price required' });
  
    try {
      const colName = table === 'lab_catalog' ? 'test_name' : (table === 'pharmacy_inventory' ? 'drug_name' : 'treatment_name');
      const insertData = { [colName]: name, price: Number(price) };
      if (table === 'pharmacy_inventory' && stock !== undefined && stock !== null) {
        insertData.stock = Number(stock);
      }
      const docRef = await db.collection(table).add(insertData);
      res.status(201).json({ id: docRef.id, name, price, stock });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.delete('/catalog/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const allowedTables = ['lab_catalog', 'pharmacy_inventory', 'treatment_catalog'];
  
  if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });

  try {
    await db.collection(table).doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reports', async (req, res) => {
    try {
      // 1. Total Metrics
      const billingSnap = await db.collection('billing').where('status', '==', 'Paid').get();
      let totalRev = 0;
      billingSnap.forEach(d => totalRev += (Number(d.data().total_amount) || 0));
  
      const patSnap = await db.collection('patients').get();
      const patCount = patSnap.size;
  
      const labSnap = await db.collection('lab_orders').get();
      const rxSnap = await db.collection('prescriptions').get();
  
      // 2. 6-Month Trend Data
      const monthLabels = [];
      const revenueTrend = [0, 0, 0, 0, 0, 0];
      const patientTrend = [0, 0, 0, 0, 0, 0];
      
      let maleCount = 0;
      let femaleCount = 0;
      let otherCount = 0;
      
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthLabels.push(d.toLocaleString('default', { month: 'short' }));
      }
      
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      
      billingSnap.forEach(d => {
        const data = d.data();
        if (!data.created_at) return;
        const date = new Date(data.created_at);
        if (date >= sixMonthsAgo) {
          const monthDiff = (date.getFullYear() - sixMonthsAgo.getFullYear()) * 12 + (date.getMonth() - sixMonthsAgo.getMonth());
          if (monthDiff >= 0 && monthDiff < 6) {
            revenueTrend[monthDiff] += (Number(data.total_amount) || 0);
          }
        }
      });
      
      patSnap.forEach(d => {
        const data = d.data();
        
        if (data.gender === 'Male') maleCount++;
        else if (data.gender === 'Female') femaleCount++;
        else otherCount++;
        
        if (!data.created_at) return;
        const date = new Date(data.created_at);
        if (date >= sixMonthsAgo) {
          const monthDiff = (date.getFullYear() - sixMonthsAgo.getFullYear()) * 12 + (date.getMonth() - sixMonthsAgo.getMonth());
          if (monthDiff >= 0 && monthDiff < 6) {
            patientTrend[monthDiff] += 1;
          }
        }
      });
  
      // 3. Top Diagnoses
      const consultSnap = await db.collection('consultations').get();
      const diagnosisCounts = {};
      
      consultSnap.forEach(d => {
        const data = d.data();
        if (data.working_diagnosis && data.working_diagnosis.trim() !== '') {
          const diag = data.working_diagnosis.trim();
          diagnosisCounts[diag] = (diagnosisCounts[diag] || 0) + 1;
        }
      });
      
      const sortedDiagnoses = Object.keys(diagnosisCounts)
        .map(key => ({ label: key, count: diagnosisCounts[key] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
        
      const diagLabels = sortedDiagnoses.map(d => d.label);
      const diagData = sortedDiagnoses.map(d => d.count);
      
      if (diagLabels.length === 0) {
        diagLabels.push('No Diagnoses Yet');
        diagData.push(1);
      }
  
      res.json({
        revenue: totalRev,
        patients: patCount,
        labs: labSnap.size,
        prescriptions: rxSnap.size,
        chartData: {
          labels: monthLabels,
          revenue: revenueTrend,
          patients: patientTrend
        },
        diagnosisData: {
          labels: diagLabels,
          data: diagData
        },
        demoData: {
          labels: ['Male', 'Female', 'Other'],
          data: [maleCount, femaleCount, otherCount]
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/purge', async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Only Admins can perform a system purge' });
  }

  const { password, phrase } = req.body;
  if (phrase.trim().toUpperCase() !== 'I CONFIRM PURGE') {
    return res.status(400).json({ error: 'Invalid verification phrase' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Verify admin password
    const userDoc = await db.collection('users').doc(req.user.id).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'Admin user not found' });
    
    const user = userDoc.data();
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect admin password' });
    }

    // Passwords match! Execute the Purge.
    const collectionsToWipe = [
      'appointments',
      'billing',
      'consultations',
      'lab_orders',
      'ordered_treatments',
      'patients',
      'prescriptions'
    ];

    for (let colName of collectionsToWipe) {
      const snap = await db.collection(colName).get();
      const batch = db.batch();
      let count = 0;
      snap.docs.forEach(doc => {
        batch.delete(doc.ref);
        count++;
        // Firestore batch limit is 500 operations, but for this scale we assume it fits or we chunk it.
        // For absolute safety, let's just delete them one by one or in smaller chunks if needed.
        // Actually, deleting one by one ensures no batch limits are hit unexpectedly.
      });
      // We will just do a Promise.all to delete docs directly to avoid batch limit issues.
      const deletePromises = snap.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
    }

    // Reset counters
    const countersRef = db.collection('counters');
    const countersSnap = await countersRef.get();
    const counterPromises = countersSnap.docs.map(doc => doc.ref.set({ count: 0 }));
    await Promise.all(counterPromises);
    // Log the purge
    await db.collection('purge_logs').add({
      timestamp: new Date().toISOString(),
      adminId: req.user.id,
      adminEmail: req.user.email || 'Unknown',
      adminName: req.user.name || 'Admin'
    });

    res.json({ success: true, message: 'System purge completed successfully' });
  } catch (err) {
    console.error("Purge Error:", err);
    res.status(500).json({ error: 'Internal server error during purge' });
  }
});


router.get('/purge-logs', async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({error: 'Forbidden'});
  try {
    const snap = await db.collection('purge_logs').orderBy('timestamp', 'desc').limit(20).get();
    const logs = [];
    snap.docs.forEach(d => logs.push({ id: d.id, ...d.data() }));
    res.json(logs);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
