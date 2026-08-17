const db = require('./firebase');

async function logAudit(userId, userName, action, details) {
  try {
    await db.collection('audit_logs').add({
      user_id: userId || 'Unknown',
      user_name: userName || 'System',
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log audit event:", err);
  }
}

module.exports = { logAudit };
