const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {
	test("Register User", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			password: "password123",
		});
		expect(res.statusCode).toBe(201);
	});
});
