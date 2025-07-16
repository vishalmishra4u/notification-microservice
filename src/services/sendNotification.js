module.exports = async function sendNotification({ userId, channel, message }) {
  console.log(`[NOTIFY] ${channel.toUpperCase()} to ${userId}: ${message}`);
  // This is where you'd integrate with real services like SendGrid, Twilio, etc.
};
