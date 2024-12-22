const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Express API",
			version: "1.0.0",
			description: "API documentation",
		},
	},
	apis: ["./src/routes/*.js"], // Path to API docs
};

const swaggerSpec = swaggerJsDoc(options);
const setupSwagger = (app) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
