const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const fromName = process.env.SMTP_FROM_NAME || 'DCMS';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    
    // Check if credentials are set, otherwise log warning
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER.includes('your_clinic_email')) {
      console.warn("WARNING: Real SMTP credentials are not configured in backend/.env!");
      console.warn(`Simulating email to ${to} with subject: "${subject}"`);
      return;
    }

    let info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html
    });

    console.log("Email successfully sent to: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Failed to send email", err);
    throw err;
  }
};

module.exports = { sendEmail };
