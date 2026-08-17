const express = require('express');
const router = express.Router();
const db = require('../firebase');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('name').get();
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        username: data.username,
        email: data.email || '',
        role: data.role,
        status: data.status,
        last_login: data.last_login,
        created_at: data.created_at
      };
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  const username = req.body.username || email; // Fallback to email if username is empty
  
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }

  try {
    const usersRef = db.collection('users');
    const existing = await usersRef.where('username', '==', username).get();
    if (!existing.empty) {
      return res.status(400).json({ error: 'A user with this email/username already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      username,
      email: email || '',
      password_hash: hash,
      role,
      status: 'active',
      created_at: new Date().toISOString()
    };
    
    const docRef = await usersRef.add(newUser);
    res.status(201).json({ id: docRef.id, name, username, email, role, status: 'active' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    
    await db.collection('users').doc(req.params.id).update({ status });
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Admin', 'Doctor', 'Receptionist', 'Lab', 'Pharmacy'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    await db.collection('users').doc(req.params.id).update({ role });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await db.collection('users').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
