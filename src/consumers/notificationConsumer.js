const kafka = require("../config/kafka");
const handlers = {
  "user.registered": require("../handlers/userRegistered.handler"),
  "user.verified": require("../handlers/userVerified.handler"),
};

require("dotenv").config();

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-group" });

const runConsumer = async () => {
  await producer.connect();
  await consumer.connect();

  const topics = ["user.registered", "user.verified"];

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      try {
        console.log(`📩 Received event: ${topic}`);

        const handler = handlers[topic];

        if (!handler) {
          console.warn(`⚠️ No handler found for topic: ${topic}`);
          return;
        }

        await handler(data);

        console.log(`✅ Event processed: ${topic}`);
        // await redis.set(redisKey, "1", "EX", 60); // Cache for 1 min
      } catch (err) {
        console.error("Notification failed:", err.message);

        const retries = data.retries || 0;
        if (retries < parseInt(process.env.MAX_RETRIES)) {
          // Retry by re-sending to main topic with incremented retry count
          await producer.send({
            topic: process.env.NOTIFICATION_TOPIC,
            messages: [
              { value: JSON.stringify({ ...data, retries: retries + 1 }) },
            ],
          });
        } else {
          // Send to DLQ
          await producer.send({
            topic: process.env.DLQ_TOPIC,
            messages: [{ value: JSON.stringify(data) }],
          });
          console.warn(`Moved to DLQ after ${retries} retries:`, data);
        }
      }
    },
  });
};

module.exports = runConsumer;
