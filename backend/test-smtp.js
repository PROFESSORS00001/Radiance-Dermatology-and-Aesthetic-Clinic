require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  console.log("Connecting to", process.env.SMTP_HOST, "port", process.env.SMTP_PORT, "as", process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    logger: true,
    debug: true
  });

  try {
    let info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: 'alfrednat2020@gmail.com',
      subject: 'Test Connection',
      text: 'Testing SMTP connection.'
    });
    console.log("Success:", info.messageId);
  } catch (err) {
    console.error("Failure:", err);
  }
}

test();
