require("dotenv").config();
const runConsumer = require("./consumers/notificationConsumer");

async function start() {
  try {
    console.log("Starting Notification Service...");

    await runConsumer();

    console.log("Notification Service is running...");
  } catch (error) {
    console.error("Failed to start notification service:", error);
    process.exit(1);
  }
}

start();
