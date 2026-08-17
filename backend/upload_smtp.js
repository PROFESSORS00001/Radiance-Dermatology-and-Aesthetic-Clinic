require('dotenv').config();
const db = require('./src/firebase');

async function run() {
  const settings = [
    { id: 'smtp_host', value: process.env.SMTP_HOST },
    { id: 'smtp_port', value: process.env.SMTP_PORT },
    { id: 'smtp_user', value: process.env.SMTP_USER },
    { id: 'smtp_pass', value: process.env.SMTP_PASS },
    { id: 'clinic_name', value: process.env.SMTP_FROM_NAME }
  ];
  
  for (const s of settings) {
    if (s.value) {
      await db.collection('settings').doc(s.id).set({ value: s.value }, { merge: true });
      console.log(`Uploaded ${s.id}`);
    }
  }
  console.log('Done uploading SMTP to Firebase');
  process.exit(0);
}
run();
