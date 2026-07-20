const db = require('./firebase');
const { sendEmail } = require('./mailer');

async function checkAndSendReminders() {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Fetch appointments scheduled for tomorrow that haven't been reminded yet
    const snap = await db.collection('appointments')
      .where('date', '==', tomorrowStr)
      .get();
      
    if (snap.empty) return;
    
    // Get all docs to check if reminder_sent is true (easier than composite indexing in Firebase sometimes)
    for (let doc of snap.docs) {
      const appt = doc.data();
      
      // Skip if already sent or cancelled
      if (appt.reminder_sent === true || appt.status === 'Cancelled' || appt.status === 'Completed') {
        continue;
      }
      
      const pId = String(appt.patient_id);
      if (!pId) continue;
      
      const patDoc = await db.collection('patients').doc(pId).get();
      if (!patDoc.exists) continue;
      const patData = patDoc.data();
      
      if (!patData.email) continue;
      
      // Send reminder email
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Appointment Reminder</h2>
          <p>Dear <strong>${patData.name}</strong>,</p>
          <p>This is a friendly reminder that you have an upcoming appointment scheduled for tomorrow.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${appt.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${appt.time}</p>
            <p style="margin: 5px 0;"><strong>Doctor:</strong> ${appt.doctor_name || 'Assigned Doctor'}</p>
            <p style="margin: 5px 0;"><strong>Reason:</strong> ${appt.reason || 'Consultation'}</p>
          </div>
          
          <p>If you need to reschedule or cancel, please contact the clinic as soon as possible.</p>
          <p>We look forward to seeing you!</p>
          <p style="color: #64748b; font-size: 0.9em; margin-top: 30px;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      `;
      
      await sendEmail(patData.email, 'Upcoming Appointment Reminder - DCMS Clinic', htmlBody);
      
      // Update appointment to mark reminder as sent
      await doc.ref.update({ reminder_sent: true });
      console.log(`[Cron] Reminder sent to ${patData.email} for appointment ${doc.id}`);
    }
  } catch (err) {
    console.error('[Cron] Error running reminder job:', err);
  }
}

function startCronJobs() {
  console.log('[Cron] Initializing background jobs...');
  // Run immediately on startup, then every 1 hour (3600000 ms)
  checkAndSendReminders();
  setInterval(checkAndSendReminders, 3600000);
}

module.exports = { startCronJobs };
