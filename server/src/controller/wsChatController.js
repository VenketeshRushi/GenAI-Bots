const socketIO = require("socket.io");

let io;

const setupWebSocket = (server) => {
	io = socketIO(server);

	// Listen for WebSocket connections
	io.on("connection", (socket) => {
		console.log("New client connected:", socket.id);

		// Listen for chat-related events
		socket.on("chatMessage", (data) => {
			console.log("Chat message received:", data);

			// Broadcast the message to other clients in the chat room
			if (data.room) {
				socket.to(data.room).emit("chatMessage", {
					user: data.user,
					message: data.message,
				});
			}
		});

		// Handle joining a chat room
		socket.on("joinRoom", (room) => {
			console.log(`${socket.id} joined room: ${room}`);
			socket.join(room); // Join the specified chat room
		});

		// Handle user disconnect
		socket.on("disconnect", () =>
			console.log("Client disconnected:", socket.id)
		);
	});
};

// Send a message to all connected WebSocket clients
const broadcastMessage = (event, message) => {
	if (io) {
		io.emit(event, message);
	}
};

module.exports = { setupWebSocket, broadcastMessage };
