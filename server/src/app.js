const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const session = require("express-session");
// const RedisStore = require('connect-redis')(session)

const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/database");
const setupSwagger = require("./config/swagger");

// Routes
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Load environment variables
dotenv.config();

// Validate critical environment variables
const { NODE_ENV, JWT_SECRET, PORT, CLIENT_URL, STATIC_FILES_PATH } =
	process.env;
if (!NODE_ENV || !JWT_SECRET || !PORT) {
	console.error("Missing critical environment variables.");
	process.exit(1);
}

// Create the Express app
const app = express();

// Create the HTTP server for WebSocket
const httpServer = http.createServer(app);

// Middleware
app.use(express.json());
app.use(helmet());

// CORS Configuration
const corsOptions = {
	origin: "*", // Allow specific origin or fallback to all origins  CLIENT_URL || "*",
	// methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	// allowedHeaders: ["Content-Type", "Authorization"],
	// credentials: true, // Include credentials if needed
};
app.use(cors(corsOptions));

// Connect to the database
connectDB();

// Rate limiter middleware
app.use(rateLimiter);

// Logger for incoming requests
app.use(morgan("combined"));

// Session middleware setup
app.use(
	session({
		secret: "sibaisudbiuasd9asyd98aydhikjxc", // Use a secret for signing the session ID cookie
		resave: false, // Don't force session to be saved back to the session store
		saveUninitialized: false, // Don't save an uninitialized session
		cookie: {
			maxAge: 30 * 60 * 1000, // Optional: Session cookie lifespan
		},
	})
);

// Passport configuration
require("./config/passport.js")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// redis used for session store
// app.use(session({
//   store: new RedisStore({
//     client
//   }),
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   }
// }))

// Serve static files
app.use("/static", express.static(STATIC_FILES_PATH || "public"));

// Swagger Documentation
setupSwagger(app);

// API Routes
app.get("/", (req, res) => {
	res.send("Welcome to the API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

app.get(
	"/api/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/api/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/fail" }),
	function (req, res) {
		// Successful authentication, redirect to the dashboard
		try {
			// Create a JWT token after successful login
			const user = req.user;

			// You can add more data to the token if necessary
			const token = jwt.sign(
				{
					id: user._id,
					email: user.email,
					isAdmin: user.isAdmin,
					googleId: user.googleId,
					avatar: user.avatar,
					membership: user.membership,
				},
				process.env.JWT_SECRET, // Use your own secret key from environment variables
				{ expiresIn: "1h" } // Set token expiration (optional)
			);

			delete user.password;
			delete req.user.password;

			// Set user data in a cookie
			res.cookie(
				"user",
				btoa(
					JSON.stringify({
						id: user._id,
						email: user.email,
						isAdmin: user.isAdmin,
						googleId: user.googleId,
						avatar: user.avatar,
						membership: user.membership,
					})
				),
				{
					httpOnly: false, // Makes the cookie inaccessible to JavaScript (recommended for security)
					secure: process.env.NODE_ENV === "production", // Only set the cookie over HTTPS in production
					maxAge: 3600000, // 1 hour
				}
			);

			// Set token in a cookie
			res.cookie("token", btoa(JSON.stringify(token)), {
				httpOnly: false, // Makes the cookie inaccessible to JavaScript (recommended for security)
				secure: process.env.NODE_ENV === "production", // Only set the cookie over HTTPS in production
				maxAge: 3600000, // 1 hour
			});

			res.redirect(`${process.env.CLIENT_URL}/dashboard`);
		} catch (err) {
			console.error("OAuth callback error:", err);
			res.status(500).send("An error occurred during authentication.");
		}
	}
);

app.get("/fail", (req, res) => {
	// console.log("fail");
	res.redirect(`${process.env.CLIENT_URL}`);
});

// Health Check Route
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Error Handling Middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
	console.log("SIGTERM signal received. Closing resources...");
	httpServer.close(() => {
		console.log("HTTP server closed.");
		process.exit(0);
	});
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = { app, httpServer };
