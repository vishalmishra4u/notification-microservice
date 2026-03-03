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

module.exports = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  logger.info("Welcome Email sent to:", to);
};
