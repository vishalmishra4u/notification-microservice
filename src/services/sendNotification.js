require("dotenv").config();
const { MailtrapClient } = require("mailtrap");
const logger = require("../utils/logger");

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY,
});

module.exports = async function sendNotification(data) {
  const sender = {
    email: process.env.FROM_EMAIL,
    name: "Mailtrap Test",
  };
  const recipients = [
    {
      email: data.email,
    },
  ];

  mailtrapClient
    .send({
      from: sender,
      to: recipients,
      subject: "Verification mail from Esports Service",
      text: `Click to verify: ${data.verificationLink}`,
    })
    .then(console.log, console.error);
  logger.info(`[EMAIL SENT] to ${recipients[0].email}: ${message}`);

  // Future: Add SMS, Push, WhatsApp here
};
