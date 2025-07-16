const runConsumer = require('./consumers/notificationConsumer');

(async () => {
  try {
    await runConsumer();
    console.log('Notification service is running...');
  } catch (err) {
    console.error('Error in notification service:', err);
  }
})();
