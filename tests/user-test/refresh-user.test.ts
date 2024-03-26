import supertest from "supertest";
import { web } from "../../src/application/web";
import { createUser, deleteUser } from "../util";
import { logger } from "../../src/application/logger";

describe("POST /api/v1/users/refresh", () => {
	beforeEach(async () => {
		await createUser();
	});

	afterEach(async () => {
		await deleteUser();
	});

	it("should produce new access token", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});

		const response = await supertest(web)
			.get("/api/v1/users/refresh")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});
});
