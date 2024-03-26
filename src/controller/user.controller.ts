import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response.error";
import {
	CreateUserRequest,
	LoginUserRequest,
	UpdateUserRequest,
	UserResponse,
} from "../model/user.model";
import { UserService } from "../service/user.service";
import { UserRequest } from "../type/user-request";

export class UserController {
	static async register(req: Request, res: Response, next: NextFunction) {
		try {
			const request: CreateUserRequest = req.body as CreateUserRequest;
			const response: UserResponse = await UserService.register(request);
			res.status(200).json({
				data: response,
			});
		} catch (error) {
			next(error);
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const request: LoginUserRequest = req.body as CreateUserRequest;
			const response: UserResponse = await UserService.login(request);
			res.cookie("jwt", response.refreshToken, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
			res.status(200).json({
				data: {
					access_token: response.accessToken,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	static async get(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const response = await UserService.get(req.user!);
			res.status(200).json({
				data: response,
			});
		} catch (error) {
			next(error);
		}
	}

	static async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const cookieJwt = req.cookies.jwt;
			if (!cookieJwt)
				throw new ResponseError(401, "Unauthorized, please login first");
			const response = await UserService.refresh(cookieJwt);
			res.status(200).json({
				data: {
					access_token: response,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	static async update(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const request: UpdateUserRequest = req.body as UpdateUserRequest;
			const response = await UserService.update(req.user!, request);
			res.status(200).json({
				data: response,
			});
		} catch (error) {
			next(error);
		}
	}

	static async logout(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const response = await UserService.logout(req.user!);
			res.cookie("jwt", "", {
				maxAge: 0,
			});
			res.status(200).json({
				data: response,
			});
		} catch (error) {
			next(error);
		}
	}
}
