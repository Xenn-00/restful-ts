import supertest from "supertest";
import { createUser, deleteUser } from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";
import { prismaClient } from "../../src/application/database";

describe("PATCH /api/v1/users/current", () => {
	beforeAll(async () => {
		await createUser();
	});

	afterAll(async () => {
		await deleteUser();
	});

	it("should be able to update password", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});

		const response = await supertest(web)
			.patch("/api/v1/users/current")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				password: "newPassword",
			});

		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(200);
	});
	it("should be able to update name", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "newPassword",
		});

		const response = await supertest(web)
			.patch("/api/v1/users/current")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				name: "newTest",
			});

		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.name).toBe("newTest");
	});

	it("should be able to update username", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "newPassword",
		});

		const response = await supertest(web)
			.patch("/api/v1/users/current")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				username: "kazuha",
			});

		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("kazuha");
	});
	it("should be able to update all", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "kazuha",
			password: "newPassword",
		});

		const response = await supertest(web)
			.patch("/api/v1/users/current")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				username: "Kazuha",
				password: "newPasswordForKazuha",
				name: "Kazuha",
			});

		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("Kazuha");

		await prismaClient.user.delete({
			where: {
				username: "Kazuha",
			},
		});
	});
});
