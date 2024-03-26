import supertest from "supertest";
import { createUser, deleteUser } from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("GET /api/v1/users/current", () => {
	beforeEach(async () => {
		await createUser();
	});

	afterEach(async () => {
		await deleteUser();
	});

	it("should can get current user", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});

		const response = await supertest(web)
			.get("/api/v1/users/current")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});
});
