// templates/welcomeEmail.js

module.exports = (fullName, verificationLink) => {
  return `
    <h1>Welcome ${fullName} 🎉</h1>
    <p>We’re excited to have you onboard.</p>
    <p>Please click on the link to <a href="${verificationLink}">verify your email</a>.</p>
  `;
};
