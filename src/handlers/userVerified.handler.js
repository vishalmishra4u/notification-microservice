// handlers/userVerified.handler.js

const sendEmail = require("../services/emailService");
const verifiedTemplate = require("../templates/verifiedEmail");

module.exports = async (data) => {
  const { email, fullName } = data.data || {};

  if (!email || !fullName) {
    throw new Error("Invalid payload for user-verified");
  }

  const html = verifiedTemplate(fullName);

  await sendEmail({
    to: email,
    subject: "Your account is verified ✅",
    html,
  });
};
