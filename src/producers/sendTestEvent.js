const kafka = require('../config/kafka');
require('dotenv').config();

const producer = kafka.producer();

const sendTestEvent = async () => {
  await producer.connect();

  const message = {
    userId: 'user-123',
    channel: 'email',
    message: 'Welcome to our service!',
  };

  await producer.send({
    topic: process.env.NOTIFICATION_TOPIC,
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Test notification event sent.');

  await producer.disconnect();
};

sendTestEvent();
