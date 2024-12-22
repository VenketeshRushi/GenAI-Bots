const buildSearchFilters = (query, schemaFields) => {
	const filters = {};

	for (const [key, value] of Object.entries(query)) {
		if (schemaFields.includes(key)) {
			// String fields: Use regex for case-insensitive partial matching
			if (typeof value === "string") {
				filters[key] = { $regex: value, $options: "i" };
			} else {
				// Non-string fields: Exact match
				filters[key] = value;
			}
		}
	}

	return filters;
};

const performSearch = async (model, query, schemaFields, options = {}) => {
	try {
		const {
			sortBy = "createdAt",
			sortOrder = "desc",
			page = 1,
			limit = 10,
			select = null,
		} = options;

		const filters = buildSearchFilters(query, schemaFields);
		const skip = (page - 1) * limit;

		const results = await model
			.find(filters)
			.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
			.skip(skip)
			.limit(limit)
			.select(select);

		const total = await model.countDocuments(filters);

		return {
			data: results,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	} catch (error) {
		console.error("Error in performSearch:", error);
		throw new Error("Database query failed");
	}
};

module.exports = { performSearch, buildSearchFilters };
