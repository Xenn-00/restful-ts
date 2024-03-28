import supertest from "supertest";
import { createUser, deleteContact, deleteUser } from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("POST /api/v1/contacts", () => {
	beforeEach(async () => {
		await createUser();
	});

	afterEach(async () => {
		await deleteContact();
		await deleteUser();
	});

	it("should be able to create new contact", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const response = await supertest(web)
			.post("/api/v1/contacts")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				first_name: "Fuma",
				last_name: "Zakko",
				email: "test@test.com",
				phone: "+81232135453",
			});
		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(201);
		expect(response.body).toBeDefined();
	});
	it("should reject if create request is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const response = await supertest(web)
			.post("/api/v1/contacts")
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				first_name: "",
				last_name: "Zakko",
				email: "test@test.com",
				phone: "+81232135453",
			});
		logger.debug(response.status);
		logger.error(response.body.errors);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
