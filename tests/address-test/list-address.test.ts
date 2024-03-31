import supertest from "supertest";
import { logger } from "../../src/application/logger";
import { web } from "../../src/application/web";
import {
	createAddressMany,
	createContact,
	createUser,
	deleteAddressMany,
	deleteContact,
	deleteUser,
	getContact,
} from "../util";

describe("GET /api/v1/contacts/:contactId/addresses", () => {
	beforeEach(async () => {
		await createUser();
		await createContact();
		await createAddressMany();
	});

	afterEach(async () => {
		await deleteAddressMany();
		await deleteContact();
		await deleteUser();
	});

	it("should be able to get addresses", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.get(`/api/v1/contacts/${contact.id}/addresses`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.info(response.status);
		logger.debug(response.body);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
	});
	it("should reject to get addresses if contact id is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const response = await supertest(web)
			.get(`/api/v1/contacts/${contact.id + 1}/addresses`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.info(response.status);
		logger.error(response.body);

		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
