require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

module.exports = async function sendNotification(data) {
  const { email, verificationLink } = data.data;
  await transporter.sendMail({
    from: '"Auth Service" <no-reply@test.com>',
    to: email,
    subject: "Verify your email",
    text: `Click here to verify: ${verificationLink}`,
    html: `<p>Click here to verify:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  });
  logger.info(`[EMAIL SENT] to ${email}: ${message}`);

  // Future: Add SMS, Push, WhatsApp here
};
