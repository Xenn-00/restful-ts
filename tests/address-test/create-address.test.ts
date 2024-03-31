import supertest from "supertest";
import {
	createContact,
	createUser,
	deleteAddressMany,
	deleteContact,
	deleteUser,
	getContact,
} from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("POST /api/v1/contacts/:contactId/addresses", () => {
	beforeEach(async () => {
		await createUser();
		await createContact();
	});

	afterEach(async () => {
		await deleteAddressMany();
		await deleteContact();
		await deleteUser();
	});

	it("should be able to create new address", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.post(`/api/v1/contacts/${contact.id}/addresses`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "street test",
				city: "city test",
				province: "province test",
				country: "country test",
				postal_code: "77128",
			});

		logger.debug(contact);
		logger.debug(response.status);
		logger.debug(response.body);

		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});

	it("should reject create new address if contact id is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.post(`/api/v1/contacts/${contact.id + 1}/addresses`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "street test",
				city: "city test",
				province: "province test",
				country: "country test",
				postal_code: "77128",
			});

		logger.debug(contact);
		logger.error(response.status);
		logger.error(response.body.errors);

		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});

	it("should reject create new address if request is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.post(`/api/v1/contacts/${contact.id + 1}/addresses`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "street test",
				city: "city test",
				province: "province test",
				country: "country test",
				postal_code: 77128,
			});

		logger.debug(contact);
		logger.error(response.status);
		logger.error(response.body.errors);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
