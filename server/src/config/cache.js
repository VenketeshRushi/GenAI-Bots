const { Worker } = require("worker_threads");
const path = require("path");

console.log(
	"cacheWorker Path ==> ",
	path.resolve(__dirname, "./../workers/cacheWorker.js")
);

const cacheWorker = new Worker(
	path.resolve(__dirname, "./../workers/cacheWorker.js")
);

cacheWorker.on("error", (error) => console.error("Cache worker error:", error));
cacheWorker.on("exit", (code) =>
	console.log(`Cache worker exited with code ${code}`)
);

const cacheOperation = (action, key, value = null, ttl = 3600) => {
	return new Promise((resolve, reject) => {
		cacheWorker.postMessage({ action, key, value, ttl });

		cacheWorker.once("message", (response) => {
			if (response.status === "success") {
				resolve(response);
			} else {
				reject(new Error(response.message));
			}
		});
	});
};

module.exports = cacheOperation;
