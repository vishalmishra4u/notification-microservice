require("dotenv").config();
const nodemailer = require("nodemailer");
const { MailtrapClient } = require("mailtrap");
const logger = require("../utils/logger");

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY,
  endpoint: "https://send.api.mailtrap.io",
});

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

console.log(
  `Mailtrap client initialized with API key: *********************** ${process.env.MAILTRAP_API_KEY}`
);
module.exports = async function sendNotification(data) {
  console.log(
    "Sending notification with data: *****************************************************************",
    data
  );
  // const sender = {
  //   email: process.env.FROM_EMAIL,
  //   name: "Mailtrap Test",
  // };
  // const recipients = [
  //   {
  //     email: data.data.email,
  //   },
  // ];

  // mailtrapClient
  //   .send({
  //     from: sender,
  //     to: recipients,
  //     subject: "Verification mail from Esports Service",
  //     text: `Click to verify: ${data.data.verificationLink}`,
  //   })
  //   .then(console.log, console.error);

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
