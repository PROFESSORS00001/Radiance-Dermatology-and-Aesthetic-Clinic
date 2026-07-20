const express = require('express');
const router = express.Router();
const db = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('settings').get();
    const settings = {};
    snapshot.docs.forEach(doc => {
      settings[doc.id] = doc.data().value;
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.collection('settings').doc(key).set({ value });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
