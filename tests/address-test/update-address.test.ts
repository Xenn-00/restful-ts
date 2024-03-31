import supertest from "supertest";
import {
	createAddress,
	createContact,
	createUser,
	deleteAddressMany,
	deleteContact,
	deleteUser,
	getAddress,
	getContact,
} from "../util";
import { web } from "../../src/application/web";
import { logger } from "../../src/application/logger";

describe("PATCH /api/v1/contacts/:contactId/addresses/:addressId", () => {
	beforeEach(async () => {
		await createUser();
		await createContact();
		await createAddress();
	});

	afterEach(async () => {
		await deleteAddressMany();
		await deleteContact();
		await deleteUser();
	});

	it("should be able to update an address", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const address = await getAddress();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "new street test",
				city: "new city test",
				province: "new province test",
				country: "new country test",
				postal_code: "77282",
			});

		logger.info(response.status);
		logger.debug(response.body);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
	});

	it("should be able to update an address by just one metadata", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const address = await getAddress();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "new street test",
			});

		logger.info(response.status);
		logger.debug(response.body);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
	});

	it("should reject update an address if request is invalid", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const address = await getAddress();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}/addresses/${address.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "new street test",
				city: "new city test",
				province: "new province test",
				country: "new country test",
				postal_code: 77282,
			});

		logger.info(response.status);
		logger.error(response.body);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("should reject update an address if contact id is not found", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const address = await getAddress();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id + 1}/addresses/${address.id}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "new street test",
				city: "new city test",
				province: "new province test",
				country: "new country test",
				postal_code: "77282",
			});

		logger.info(response.status);
		logger.error(response.body);

		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});

	it("should reject update an address if address id is not found", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const contact = await getContact();
		const address = await getAddress();
		const response = await supertest(web)
			.patch(`/api/v1/contacts/${contact.id}/addresses/${address.id + 1}`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.send({
				street: "new street test",
				city: "new city test",
				province: "new province test",
				country: "new country test",
				postal_code: "77282",
			});

		logger.info(response.status);
		logger.error(response.body);

		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});
