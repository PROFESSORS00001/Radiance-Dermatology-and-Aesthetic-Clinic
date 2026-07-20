const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { requireAuth } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      next();
    });
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', requireAuth, require('./routes/users'));
app.use('/api/patients', requireAuth, require('./routes/patients'));
app.use('/api/appointments', requireAuth, require('./routes/appointments'));
app.use('/api/consultations', requireAuth, require('./routes/consultations'));
app.use('/api/laboratory', requireAuth, require('./routes/laboratory'));
app.use('/api/nursing', requireAuth, require('./routes/nursing'));
app.use('/api/pharmacy', requireAuth, require('./routes/pharmacy'));
app.use('/api/billing', requireAuth, require('./routes/billing'));
app.use('/api/settings', requireAuth, require('./routes/settings'));
app.use('/api/admin', requireAuth, require('./routes/admin'));
app.use('/api/email', require('./routes/email'));

// Ping Route for Latency Tracker
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

const db = require('./firebase');
app.get('/api/public/branding', async (req, res) => {
  try {
    const snap = await db.collection('settings').get();
    const data = {};
    snap.docs.forEach(d => {
      if (['clinic_name', 'clinic_logo'].includes(d.id)) {
        data[d.id] = d.data().value;
      }
    });
    res.json(data);
  } catch (err) {
    res.json({}); // Silently return empty if error
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({error: 'API route not found'});
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DCMS backend listening on port ${PORT}`);
  
  // Start Cron Jobs
  const { startCronJobs } = require('./cron');
  startCronJobs();
});
