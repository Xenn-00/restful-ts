import supertest from "supertest";
import { createUser, deleteUser } from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("POST /api/v1/users/login", () => {
	beforeEach(async () => {
		await createUser();
	});

	afterEach(async () => {
		await deleteUser();
	});
	it("should be able to login", async () => {
		const response = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});

		logger.debug(response.body);
		logger.debug(response.get("Set-Cookie"));
		expect(response.status).toBe(200);
		expect(response.body.data.access_token).toBeDefined();
		expect(response.get("Set-Cookie")).toBeDefined();
	});

	it("should reject if username or password is invalid", async () => {
		const response = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "test1",
		});
		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
		expect(response.body.errors).toBe("username or password is wrong!");
	});
});
