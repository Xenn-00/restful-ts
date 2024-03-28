import supertest from "supertest";
import { logger } from "../../src/application/logger";
import { web } from "../../src/application/web";
import {
	createContactMany,
	createUser,
	deleteContact,
	deleteUser,
} from "../util";

describe("GET /api/v1/contacts", () => {
	beforeEach(async () => {
		await createUser();
		await createContactMany();
	});

	afterEach(async () => {
		await deleteContact();
		await deleteUser();
	});

	it("should be able to query existing contact", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const response = await supertest(web)
			.get(`/api/v1/contacts`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"));

		logger.debug(response.status);
		logger.debug(response.body.data);
		logger.debug(response.body.paging.size);
		logger.debug(response.body.paging.total_page);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
		expect(response.body.data.length).toBe(10);
		expect(response.body.paging.size).toBe(10);
		expect(response.body.paging.current_page).toBe(1);
	});

	it("should be able to query existing contact with param variable", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const response = await supertest(web)
			.get(`/api/v1/contacts`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.query({
				name: "Fuma 1",
			});

		logger.debug(response.status);
		logger.debug(response.body);
		logger.debug(response.body.paging.size);
		logger.debug(response.body.paging.total_page);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
		expect(response.body.paging).toBeDefined();
	});
	it("should be able to query existing contact with param page", async () => {
		const login = await supertest(web).post("/api/v1/users/login").send({
			username: "test",
			password: "testtesttest",
		});
		const response = await supertest(web)
			.get(`/api/v1/contacts`)
			.set("Authorization", login.body.data.access_token)
			.set("Cookie", login.get("Set-Cookie"))
			.query({
				page: 2,
			});

		logger.debug(response.status);
		logger.debug(response.body);
		logger.debug(response.body.paging.size);
		logger.debug(response.body.paging.total_page);

		expect(response.status).toBe(200);
		expect(response.body.data).toBeDefined();
		expect(response.body.paging).toBeDefined();
	});
});
