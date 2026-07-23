const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { sendEmail } = require('../mailer');
const nodemailer = require('nodemailer'); // To attach the buffer

router.post('/send-pdf', requireAuth, async (req, res) => {
  try {
    const { to, subject, htmlBody, htmlString, filename } = req.body;

    if (!to || !htmlString) {
      return res.status(400).json({ error: 'Missing recipient email or HTML string for PDF.' });
    }

    const { generatePdfBuffer } = require('../pdfService');
    const pdfBuffer = await generatePdfBuffer(htmlString);

    const transporter = require('nodemailer').createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const fromName = process.env.SMTP_FROM_NAME || 'Radiance Derms';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("WARNING: Real SMTP credentials are not configured in backend/.env!");
      return res.json({ success: true, simulated: true });
    }

    let info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject || "Document attached",
      html: htmlBody || "<p>Please find your document attached.</p>",
      attachments: [
        {
          filename: filename || 'document.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log("PDF Email successfully sent to: %s", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Failed to send PDF email", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
