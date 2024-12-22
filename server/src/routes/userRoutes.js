const express = require("express");
const router = express.Router();

const cacheMiddleware = require("../middlewares/cacheMiddleware");
const { performSearch } = require("../utils/getDataFormQueryParam");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Route: Get a user by ID with caching.
 */
router.get("/user/:id", authMiddleware, cacheMiddleware(), async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId); // Actual database call

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching user by ID:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

/**
 * Route: Search users with dynamic filters and caching.
 */
router.get(
	"/search",
	authMiddleware,
	cacheMiddleware((req) => `search:users:${JSON.stringify(req.query)}`),
	async (req, res) => {
		try {
			// Define searchable fields for the User model
			const searchableFields = ["name", "email", "role"]; // Add more fields as necessary

			// Query options (pagination, sorting, field selection, etc.)
			const options = {
				sortBy: req.query.sortBy || "createdAt",
				sortOrder: req.query.sortOrder || "desc",
				page: parseInt(req.query.page, 10) || 1,
				limit: parseInt(req.query.limit, 10) || 10,
				select: req.query.select || null, // Optional field selection
			};

			// Perform search
			const results = await performSearch(
				User,
				req.query,
				searchableFields,
				options
			);

			return res.status(200).json(results);
		} catch (error) {
			console.error("Error performing search:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
);

module.exports = router;
