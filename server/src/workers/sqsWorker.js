const sqs = require("../config/sqs");

// Define the SQS Queue URL
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

/**
 * Add a job to the SQS queue.
 * @param {Object} data - The data to enqueue.
 */
const addJobToQueue = async (data) => {
	const params = {
		QueueUrl: QUEUE_URL,
		MessageBody: JSON.stringify(data), // Serialize the data to JSON
	};

	try {
		const result = await sqs.sendMessage(params).promise();
		console.log("Job added to SQS:", result.MessageId);
		return result.MessageId;
	} catch (error) {
		console.error("Error adding job to SQS:", error);
		throw error;
	}
};

/**
 * Process messages from the SQS queue.
 */
const processQueue = async () => {
	const params = {
		QueueUrl: QUEUE_URL,
		MaxNumberOfMessages: 10, // Adjust based on your application's needs
		WaitTimeSeconds: 20, // Long polling to reduce empty responses
	};

	try {
		const result = await sqs.receiveMessage(params).promise();

		if (result.Messages) {
			for (const message of result.Messages) {
				const jobData = JSON.parse(message.Body);
				console.log("Processing job:", jobData);

				// Process the job here (replace this with your actual logic)
				try {
					await handleJob(jobData);
					// Delete the message from the queue after processing
					await deleteMessage(message.ReceiptHandle);
				} catch (jobError) {
					console.error("Error processing job:", jobError);
				}
			}
		} else {
			console.log("No messages to process");
		}
	} catch (error) {
		console.error("Error receiving messages from SQS:", error);
	}
};

/**
 * Handle individual job processing (custom logic).
 * @param {Object} jobData - The data of the job to process.
 */
const handleJob = async (jobData) => {
	// Example job logic
	console.log("Handling job with data:", jobData);
};

/**
 * Delete a message from the SQS queue.
 * @param {string} receiptHandle - The receipt handle of the message to delete.
 */
const deleteMessage = async (receiptHandle) => {
	const params = {
		QueueUrl: QUEUE_URL,
		ReceiptHandle: receiptHandle,
	};

	try {
		await sqs.deleteMessage(params).promise();
		console.log("Message deleted from SQS");
	} catch (error) {
		console.error("Error deleting message from SQS:", error);
	}
};

// Periodically poll the SQS queue
setInterval(processQueue, 5000);

module.exports = { addJobToQueue };
