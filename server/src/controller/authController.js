const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
const register = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if the email already exists
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({ message: "Email is already in use." });
		}

		// we are already hashing the password in the User model before saving it check there

		// Create the new user
		const user = await User.create({ email, password });

		// Exclude sensitive information from response
		user.password = undefined;
		// Generate a JWT token
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				isAdmin: user.isAdmin,
				googleId: user.googleId,
				avatar: user.avatar,
				membership: user.membership,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);
		res
			.status(201)
			.json({ message: "User registered successfully.", user, token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Log in an existing user
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if the user exists
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(401).json({ message: "Invalid email." });
		}

		console.log(
			"user*************",
			JSON.stringify(user, null, 2),
			email,
			password
		);

		// Compare the provided password with the hashed password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		console.log("isPasswordValid*************", isPasswordValid);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid password." });
		}

		// Generate a JWT token
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				isAdmin: user.isAdmin,
				googleId: user.googleId,
				avatar: user.avatar,
				membership: user.membership,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		res.status(200).json({ message: "Login successful.", user, token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { register, login };
