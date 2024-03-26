import supertest from "supertest";
import { logger } from "../../src/application/logger";
import { web } from "../../src/application/web";
import { createUser, deleteUser } from "../util";

describe("POST /api/v1/users", () => {
	afterEach(async () => {
		await deleteUser();
	});
	it("should reject register new user if request is invalid", async () => {
		const response = await supertest(web).post("/api/v1/users").send({
			username: "test",
			password: "",
			name: "",
		});

		logger.info(response.body);
		logger.info(response.status);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("should accept register new user", async () => {
		const response = await supertest(web).post("/api/v1/users").send({
			username: "test",
			password: "testtesttest",
			name: "test",
		});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
	});

	it("should reject if username is already taken", async () => {
		await createUser();

		const response = await supertest(web).post("/api/v1/users").send({
			username: "test",
			password: "testtestest",
			name: "test",
		});

		logger.debug(response);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
