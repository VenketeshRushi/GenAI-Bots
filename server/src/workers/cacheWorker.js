const { parentPort } = require("worker_threads");
const Redis = require("ioredis");

// Initialize Redis client
const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => console.log("Redis connected in worker"));
redisClient.on("error", (error) =>
	console.error("Redis error in worker:", error)
);

// Graceful shutdown
const shutdownWorker = async () => {
	console.log("Shutting down Redis worker...");
	try {
		await redisClient.quit();
		console.log("Redis connection closed.");
	} catch (error) {
		console.error("Error during Redis shutdown:", error.message);
	}
	process.exit(0);
};

// Listen for termination signals
process.on("SIGTERM", shutdownWorker);
process.on("SIGINT", shutdownWorker);

// Validate the incoming message
const validateMessage = (message) => {
	if (!message || typeof message !== "object" || !message.action) {
		throw new Error("Invalid message format");
	}
	if (!["SET", "GET", "DELETE"].includes(message.action)) {
		throw new Error("Invalid action specified");
	}
	if (!message.key || typeof message.key !== "string") {
		throw new Error("A valid 'key' is required");
	}
};

// Listen for messages from the main thread
parentPort.on("message", async ({ action, key, value, ttl }) => {
	try {
		validateMessage({ action, key, value, ttl });

		switch (action) {
			case "SET":
				if (typeof ttl !== "number" || ttl <= 0) {
					throw new Error("Invalid TTL value");
				}
				await redisClient.setex(key, ttl, JSON.stringify(value));
				parentPort.postMessage({ status: "success", action, key });
				break;

			case "GET":
				const cachedData = await redisClient.get(key);
				parentPort.postMessage({
					status: "success",
					action,
					key,
					data: cachedData ? JSON.parse(cachedData) : null,
				});
				break;

			case "DELETE":
				await redisClient.del(key);
				parentPort.postMessage({ status: "success", action, key });
				break;

			default:
				parentPort.postMessage({ status: "error", message: "Invalid action" });
		}
	} catch (error) {
		console.error("Worker error:", error.message);
		parentPort.postMessage({ status: "error", message: error.message });
	}
});
