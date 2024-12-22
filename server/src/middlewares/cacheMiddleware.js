const cacheOperation = require("../config/cache");

const cacheMiddleware = (keyGenerator) => async (req, res, next) => {
	try {
		const cacheKey = keyGenerator ? keyGenerator(req) : req.originalUrl;

		// Check cache via worker
		const { data } = await cacheOperation("GET", cacheKey);

		if (data) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(200).json(data);
		}

		console.log(`Cache miss for key: ${cacheKey}`);

		// Overwrite res.json to store data in cache
		const originalJson = res.json.bind(res);
		res.json = async (data) => {
			await cacheOperation(
				"SET",
				cacheKey,
				data,
				process.env.REDIS_CACHE_TTL || 3600
			);
			originalJson(data);
		};

		next();
	} catch (error) {
		console.error("Cache middleware error:", error);
		next(); // Proceed without caching on error
	}
};

module.exports = cacheMiddleware;
