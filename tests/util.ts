import bcrypt from "bcrypt";
import { prismaClient } from "../src/application/database";
import { ResponseError } from "../src/error/response.error";

export const createUser = async () => {
	await prismaClient.user.create({
		data: {
			username: "test",
			password: (await bcrypt.hash("testtesttest", 10)).toString(),
			name: "testUser",
		},
	});
};

export const createContact = async () => {
	await prismaClient.contact.create({
		data: {
			username: "test",
			first_name: "Fuma",
			last_name: "Zakko",
			email: "test@test.com",
			phone: "+81232135453",
		},
	});
};

export const deleteUser = async () => {
	await prismaClient.user.deleteMany({
		where: {
			username: "test",
		},
	});
};

export const deleteContact = async () => {
	await prismaClient.contact.deleteMany({
		where: {
			username: "test",
		},
	});
};

export const getContact = async () => {
	const response = await prismaClient.contact.findFirst({
		where: {
			username: "test",
		},
	});

	if (!response) throw new ResponseError(404, "contact is not found");

	return response;
};

export const createContactMany = async () => {
	const data: {
		username: string;
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
	}[] = [];
	for (let i = 1; i <= 15; i++) {
		data.push({
			username: `test`,
			first_name: `Fuma ${i}`,
			last_name: `Zakko ${i}`,
			email: "test@test.com",
			phone: "+81232135453",
		});
	}

	await prismaClient.contact.createMany({
		data: data,
	});
};

export const deleteAddressMany = async () => {
	await prismaClient.address.deleteMany({
		where: {
			contact: {
				username: "test",
			},
		},
	});
};

export const createAddress = async () => {
	const contact = await getContact();
	await prismaClient.address.create({
		data: {
			contact_id: contact.id,
			street: "street test",
			city: "city test",
			province: "province test",
			country: "country test",
			postal_code: "77282",
		},
	});
};
export const createAddressMany = async () => {
	const contact = await getContact();
	const data: {
		contact_id: number;
		street: string;
		city: string;
		province: string;
		country: string;
		postal_code: string;
	}[] = [];
	for (let i = 1; i <= 10; i++) {
		data.push({
			contact_id: contact.id,
			street: `street test ${i}`,
			city: `city test ${i}`,
			province: `province test ${i}`,
			country: `country test ${i}`,
			postal_code: `77284${i}`,
		});
	}

	await prismaClient.address.createMany({
		data: data,
	});
};

export const getAddress = async () => {
	const contact = await getContact();
	const response = await prismaClient.address.findFirst({
		where: {
			contact_id: contact.id,
		},
	});

	if (!response) throw new ResponseError(404, "address is not found");

	return response;
};
export const getAddressMany = async () => {
	const contact = await getContact();
	const response = await prismaClient.address.findMany({
		where: {
			contact_id: contact.id,
		},
	});

	if (!response) throw new ResponseError(404, "address is not found");

	return response;
};
