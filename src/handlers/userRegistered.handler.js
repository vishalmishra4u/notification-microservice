// handlers/userRegistered.handler.js

const sendEmail = require("../services/emailService");
const welcomeTemplate = require("../templates/welcomeEmail");

module.exports = async (data) => {
  console.log("Processing user-registered event with data:", data);
  const { email, fullName, verificationLink } = data.data || {};

  if (!email || !fullName || !verificationLink) {
    throw new Error("Invalid payload for user-registered");
  }

  const html = welcomeTemplate(fullName, verificationLink);

  await sendEmail({
    to: email,
    subject: "Welcome to our platform, Please verify your email! 🎉",
    html,
  });
};
