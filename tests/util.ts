import bcrypt from "bcrypt";
import { prismaClient } from "../src/application/database";

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
		select: {
			id: true,
		},
	});

	if (!response) throw new Error("contact is not found");

	return response;
};

export const createContactMany = async () => {
	for (let i = 1; i <= 15; i++) {
		await prismaClient.contact.create({
			data: {
				username: "test",
				first_name: `Fuma ${i}`,
				last_name: `zakko ${i}`,
				email: "fumaZakko@hololiven.com",
				phone: "+81267122387",
			},
		});
	}
};
