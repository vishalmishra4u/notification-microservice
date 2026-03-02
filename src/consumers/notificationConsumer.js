const kafka = require("../config/kafka");
const { KAFKA_TOPICS } = require("../config/topics");
// const redis = require("../config/redis");
const sendNotification = require("../services/sendNotification");
require("dotenv").config();

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "notification-group" });

const runConsumer = async () => {
  console.log(
    "Connecting to Kafka... coming here -----------------------------"
  );
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({
    topic: KAFKA_TOPICS.USER_REGISTERED,
    fromBeginning: true, // set false later
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(
        "Received message #######################:",
        message.value.toString()
      );
      const data = JSON.parse(message.value.toString());
      // const redisKey = `notified:${data.userId}:${data.channel}`;

      // Deduplication
      // if (await redis.get(redisKey)) return;

      try {
        await sendNotification(data);
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
