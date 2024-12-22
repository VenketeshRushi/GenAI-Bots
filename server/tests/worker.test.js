const cluster = require("cluster");
const supertest = require("supertest");
const app = require("../app"); // assuming your app is exported from app.js

describe("Cluster Worker Tests", () => {
	let server;

	beforeAll((done) => {
		// Start the app server before tests begin
		server = app.listen(3000, () => {
			console.log("Server started for testing");
			done();
		});
	});

	afterAll((done) => {
		// Close the server after tests are complete
		server.close(() => {
			console.log("Server closed");
			done();
		});
	});

	describe("Worker Crash Simulation", () => {
		it("should restart worker on crash", (done) => {
			const originalWorkerCount = Object.keys(cluster.workers).length;

			// Simulate worker crash
			const worker = cluster.fork();
			worker.process.kill();

			setTimeout(() => {
				// Ensure new worker is forked
				expect(Object.keys(cluster.workers).length).toBe(
					originalWorkerCount + 1
				);
				done();
			}, 1000);
		});
	});

	describe("High Traffic Simulation", () => {
		it("should handle high traffic gracefully", (done) => {
			const numRequests = 100; // simulate 100 concurrent requests
			let responses = 0;

			// Make multiple concurrent requests
			for (let i = 0; i < numRequests; i++) {
				supertest(app)
					.get("/")
					.end((err, res) => {
						if (err) {
							done(err);
						} else {
							responses++;
							if (responses === numRequests) {
								done();
							}
						}
					});
			}
		});
	});

	describe("Graceful Shutdown", () => {
		it("should shut down the worker gracefully", (done) => {
			const worker = cluster.fork();

			// Simulate a graceful shutdown
			worker.on("exit", (code, signal) => {
				if (signal === "SIGTERM") {
					done();
				}
			});

			// Trigger graceful shutdown (SIGTERM)
			process.kill(worker.process.pid, "SIGTERM");
		});
	});

	describe("Health Check Endpoint", () => {
		it("should return a 200 status for health check", async () => {
			const res = await supertest(app).get("/health");
			expect(res.status).toBe(200);
			expect(res.body.status).toBe("OK");
		});
	});
});
