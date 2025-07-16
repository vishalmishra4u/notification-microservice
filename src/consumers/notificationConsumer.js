const kafka = require("../config/kafka");
const redis = require("../config/redis");
const sendNotification = require("../services/sendNotification");
require("dotenv").config();

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-group" });

const runConsumer = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      const redisKey = `notified:${data.userId}:${data.channel}`;

      // Deduplication
      if (await redis.get(redisKey)) return;

      try {
        await sendNotification(data);
        await redis.set(redisKey, "1", "EX", 60); // Cache for 1 min
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
