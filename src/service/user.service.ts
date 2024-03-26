import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response.error";
import {
	CreateUserRequest,
	LoginUserRequest,
	UpdateUserRequest,
	UserResponse,
	toUserResponse,
} from "../model/user.model";
import { accessTokenSign, refershTokenSign } from "../util/sign-jwt";
import { UserValidation } from "../validation/User/user.validation";
import { Validation } from "../validation/validation";

export class UserService {
	static async register(request: CreateUserRequest): Promise<UserResponse> {
		const registerRequest = Validation.validate(
			UserValidation.REGISTER,
			request
		);
		const totalUserWithSameUsername = await prismaClient.user.count({
			where: {
				username: registerRequest.username,
			},
		});

		if (totalUserWithSameUsername !== 0)
			throw new ResponseError(400, "Username already exist");

		registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

		const user = await prismaClient.user.create({
			data: registerRequest,
		});

		return toUserResponse(user);
	}

	static async login(request: LoginUserRequest): Promise<UserResponse> {
		const loginRequest = Validation.validate(UserValidation.LOGIN, request);

		let user = await prismaClient.user.findUnique({
			where: {
				username: loginRequest.username,
			},
		});

		if (!user) throw new ResponseError(404, "user is not found!");
		const isPasswordValid = await bcrypt.compare(
			loginRequest.password,
			user.password
		);
		if (!isPasswordValid)
			throw new ResponseError(400, "username or password is wrong!");

		const payload: { username: string; password: string; name: string } = {
			username: user.username,
			password: user.password,
			name: user.name,
		};
		const refreshToken = refershTokenSign(
			payload,
			process.env.REFRESH_TOKEN_SECRET
		);

		user = await prismaClient.user.update({
			where: {
				username: loginRequest.username,
			},
			data: {
				token: refreshToken,
			},
		});

		const accessToken = accessTokenSign(
			payload,
			process.env.ACCESS_TOKEN_SECRET
		);
		const response = toUserResponse(user);
		response.accessToken = accessToken;
		response.refreshToken = refreshToken;

		return response;
	}

	static async get(user: User): Promise<UserResponse> {
		return toUserResponse(user);
	}

	static async refresh(cookieJwt: string): Promise<string> {
		const decoded = jwt.verify(cookieJwt, process.env.REFRESH_TOKEN_SECRET, {
			algorithms: ["HS256"],
		});
		if (!decoded)
			throw new ResponseError(401, "Unauthorized, please login first");
		const user: User = decoded as User;
		const payload: { username: string; name: string } = {
			username: user.username,
			name: user.name,
		};
		const newAccessToken = accessTokenSign(
			payload,
			process.env.ACCESS_TOKEN_SECRET
		);

		return newAccessToken;
	}

	static async update(
		user: User,
		request: UpdateUserRequest
	): Promise<UserResponse> {
		const updateRequest = Validation.validate(UserValidation.UPDATE, request);

		if (updateRequest.name) {
			user.name = updateRequest.name;
		}
		if (updateRequest.password) {
			user.password = await bcrypt.hash(updateRequest.password, 10);
		}

		const response = await prismaClient.user.update({
			where: {
				username: user.username,
			},
			data: {
				username: updateRequest.username
					? updateRequest.username
					: user.username,
				name: user.name,
				password: user.password,
			},
		});

		return toUserResponse(response);
	}

	static async logout(user: User): Promise<string> {
		await prismaClient.user.update({
			where: {
				username: user.username,
			},
			data: {
				token: null,
			},
		});
		return "OK";
	}
}
