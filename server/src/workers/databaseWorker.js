const { parentPort } = require("worker_threads");

parentPort.on("message", async (data) => {
	// Simulate database-heavy work
	const result = await performHeavyDatabaseOperation(data);
	parentPort.postMessage(result);
});

async function performHeavyDatabaseOperation(data) {
	return `Processed ${data} in worker thread.`;
}
