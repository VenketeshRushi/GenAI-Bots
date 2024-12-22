const express = require("express");
const { broadcastMessage } = require("../controller/wsChatController");

const router = express.Router();

// REST API route for chat history
router.get("/history", async (req, res) => {
	// Example: Fetch chat history from a database
	const chatHistory = [
		{ user: "John", message: "Hello!" },
		{ user: "Jane", message: "Hi there!" },
	];

	res.status(200).json(chatHistory);
});

// Example: REST API endpoint to broadcast a message
router.post("/broadcast", (req, res) => {
	const { event, message } = req.body;
	broadcastMessage(event, message);
	res.status(200).json({ success: true, message: "Message broadcasted." });
});

module.exports = router;
