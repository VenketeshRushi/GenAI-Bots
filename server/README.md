AWS SQS

Usage
To add a job to the queue:

javascript
Copy code
const { addJobToQueue } = require('./workers/sqsWorker');

// Example of adding a job
const jobData = { task: 'send_email', payload: { to: 'user@example.com', subject: 'Welcome' } };
addJobToQueue(jobData).then((messageId) => {
console.log('Job added successfully with ID:', messageId);
});
To process jobs:

The processQueue function in the worker will automatically poll and process jobs every 5 seconds.
How It Works
Add Job: The addJobToQueue function sends a message to the SQS queue.
Poll Queue: The processQueue function periodically polls the SQS queue for new messages.
Process Job: Each message is parsed and passed to handleJob for custom processing logic.
Delete Message: Successfully processed messages are deleted from the queue.
This setup ensures that tasks are reliably enqueued and processed using AWS SQS. Let me know if you need further refinements!

//

    // // Setup worker-specific health checks
    // setupWorkerHealthCheck();

    // // Listen for shutdown signal from master process
    // process.on("message", (msg) => {
    // 	if (msg.type === "shutdown") {
    // 		console.log(`Worker ${process.pid} shutting down...`);
    // 		// Perform any necessary cleanup here (e.g., closing DB connections)
    // 		server.close(() => {
    // 			console.log(`Worker ${process.pid} terminated gracefully.`);
    // 			process.exit(0);
    // 		});
    // 	}
    // });

    // // Handle cleanup on termination signals
    // process.on("SIGTERM", () => {
    // 	console.log(`Worker ${process.pid} shutting down...`);
    // 	// Perform any necessary cleanup here (e.g., closing DB connections)
    // 	process.exit(0);
    // });
