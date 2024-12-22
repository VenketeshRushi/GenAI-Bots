const cluster = require("cluster");
const os = require("os");
const { app, httpServer } = require("./app");
const { setupWebSocket } = require("./controller/wsChatController");

const PORT = process.env.PORT || 8000;
const NUM_WORKERS =
	process.env.NODE_ENV === "development" ? 2 : os.availableParallelism();

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	// Fork workers
	for (let i = 0; i < NUM_WORKERS; i++) {
		try {
			cluster.fork();
		} catch (error) {
			console.error("Error while forking a new worker:", error);
		}
	}

	// Listen for worker exit and restart
	cluster.on("exit", (worker, code, signal) => {
		console.error(
			`Worker ${worker.process.pid} exited with code ${code} (signal: ${signal}). Restarting...`
		);
		cluster.fork();
	});

	// Graceful shutdown
	const handleShutdown = (signal) => {
		console.log(`Master received ${signal}. Shutting down gracefully...`);
		for (const id in cluster.workers) {
			cluster.workers[id].send({ type: "shutdown" });
		}
		setTimeout(() => process.exit(0), 10000); // Allow workers more time to clean up
	};

	process.on("SIGTERM", () => handleShutdown("SIGTERM"));
	process.on("SIGINT", () => handleShutdown("SIGINT"));
} else {
	// Worker processes
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}, Worker ${process.pid}`);
	});

	// Setup WebSocket
	setupWebSocket(httpServer);

	// Handle shutdown message from master
	process.on("message", (msg) => {
		if (msg.type === "shutdown") {
			console.log(`Worker ${process.pid} shutting down...`);
			httpServer.close(() => process.exit(0));
		}
	});
}
