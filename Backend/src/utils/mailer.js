const nodemailer = require('nodemailer');

function getTransport() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    SMTP_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null; // no SMTP configured
  }
  const secure = String(SMTP_SECURE || '').toLowerCase() === 'true';
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  transporter._from = SMTP_FROM || SMTP_USER;
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransport();
  if (!transporter) {
    console.log('[mailer:dry-run] to:', to, 'subject:', subject);
    console.log(text || html);
    return { dryRun: true };
  }
  const info = await transporter.sendMail({
    from: transporter._from,
    to,
    subject,
    html,
    text,
  });
  return info;
}

module.exports = { sendMail };
