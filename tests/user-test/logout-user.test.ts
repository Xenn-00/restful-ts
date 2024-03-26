import supertest from "supertest";
import { createUser, deleteUser } from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("DELETE /api/v1/users/logout", () => {
	beforeAll(async () => {
		await createUser();
	});

	afterAll(async () => {
		await deleteUser();
	});

	it("should be able to logout", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});

		logger.debug(login.get("Set-Cookie"));

		const response = await supertest(web)
			.delete("/api/v1/users/logout")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.debug(response.status);
		logger.debug(response.body);
		logger.debug(response.get("Set-Cookie"));
		expect(response.status).toBe(200);
	});
});
