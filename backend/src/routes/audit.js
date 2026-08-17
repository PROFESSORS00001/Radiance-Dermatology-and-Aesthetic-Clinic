const express = require('express');
const router = express.Router();
const db = require('../firebase');

// GET all audit logs
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('audit_logs').orderBy('timestamp', 'desc').limit(100).get();
    const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
