require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const logger = require("../utils/logger");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendNotification({ userId, channel, message }) {
  if (channel === "email") {
    const msg = {
      to: "testuser@example.com", // Replace with real user email
      from: process.env.FROM_EMAIL,
      subject: "Notification",
      text: message,
    };

    await sgMail.send(msg);
    logger.info(`[EMAIL SENT] to ${msg.to}: ${msg.text}`);
  }

  // Future: Add SMS, Push, WhatsApp here
  else {
    throw new Error(`Unsupported channel: ${channel}`);
  }
};
