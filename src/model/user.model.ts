import { User } from "@prisma/client";

export type UserResponse = {
	username: string;
	name: string;
	accessToken?: string;
	refreshToken?: string;
};

export type CreateUserRequest = {
	username: string;
	password: string;
	name: string;
};
export type LoginUserRequest = {
	username: string;
	password: string;
};

export type UpdateUserRequest = {
	username: string;
	password: string;
	name: string;
};

export function toUserResponse(user: User): UserResponse {
	return {
		name: user.name,
		username: user.username,
	};
}
