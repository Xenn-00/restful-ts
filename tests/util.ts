import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

export const createUser = async () => {
	await prismaClient.user.create({
		data: {
			username: "test",
			password: (await bcrypt.hash("testtesttest", 10)).toString(),
			name: "testUser",
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
