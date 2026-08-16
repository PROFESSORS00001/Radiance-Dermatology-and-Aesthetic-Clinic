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

    let pdfBuffer = null;
    try {
      const { generatePdfBuffer } = require('../pdfService');
      pdfBuffer = await generatePdfBuffer(htmlString);
    } catch (pdfErr) {
      console.error("PDF generation failed in route /send-pdf, falling back to plain email:", pdfErr);
    }

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

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject || "Document attached",
      html: htmlBody || "<p>Please find your document attached.</p>"
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: filename || 'document.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ];
    } else {
      // Inline the actual document content directly into the email body as fallback!
      mailOptions.html = htmlString;
      mailOptions.html += `<p style="color:#64748b; font-size:12px; margin-top:2rem; border-top:1px dashed #cbd5e1; padding-top:1rem;">Note: This document could not be rendered as a PDF attachment on your system, so the details have been displayed directly in the email body above.</p>`;
    }

    let info = await transporter.sendMail(mailOptions);

    console.log("Email successfully sent to: %s", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Failed to send email", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
