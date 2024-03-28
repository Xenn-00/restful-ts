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

describe("PATCH /api/v1/contacts/contactId", () => {
	beforeEach(async () => {
		await createUser();
		await createContact();
	});

	afterEach(async () => {
		await deleteContact();
		await deleteUser();
	});

	it("should be able to update an existing contact", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				first_name: "Auza",
				last_name: "Zenin",
				email: "newtest@test.com",
				phone: "+812327899569",
			});

		logger.debug(response.status);
		logger.debug(response.body);

		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
		expect(response.body.data.first_name).toBe("Auza");
	});

	it("should reject update if contact is not found", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id + 1}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				first_name: "Auza",
				last_name: "Zenin",
				email: "newtest@test.com",
				phone: "+812327899569",
			});

		logger.error(response.status);
		logger.error(response.body);

		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});

	it("should reject update if contact request is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				first_name: "Auza",
				last_name: "Zenin",
				email: "newtest",
				phone: "+812327899569",
			});

		logger.error(response.status);
		logger.error(response.body);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
