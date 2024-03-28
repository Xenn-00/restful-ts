import supertest from "supertest";
import {
	createContact,
	createUser,
	deleteContact,
	deleteUser,
	getContact,
} from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("GET /api/v1/contacts/contactId", () => {
	beforeEach(async () => {
		await createUser();
		await createContact();
	});

	afterEach(async () => {
		await deleteContact();
		await deleteUser();
	});

	it("should be able to remove existing contact", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		let contact = await getContact();
		const response = await supertest(web)
			.delete(`/api/v1/contacts/${contact.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.debug(response.status);
		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});
	it("should reject remove if contact is not found", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		let contact = await getContact();
		const response = await supertest(web)
			.delete(`/api/v1/contacts/${contact.id + 1}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.error(response.status);
		logger.error(response.body.errors);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
