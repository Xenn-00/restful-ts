import { NextFunction, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ResponseError } from "../error/response.error";
import { UserRequest } from "../type/user-request";
import { User } from "@prisma/client";

export const authMiddleware = (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const accessToken = req.header("Authorization")?.replace("Bearer ", "");
		if (!accessToken) throw new ResponseError(401, "Unauthorized");

		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {
			algorithms: ["HS256"],
		});
		if (!decoded) {
			throw new ResponseError(401, "Unauthorized token, please login first");
		}

		req.user = decoded as User;
		next();
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			res
				.status(401)
				.json({
					errors: "Unauthorized: Invalid token",
				})
				.end();
		} else {
			res
				.status(500)
				.json({
					errors: "Internal Server Error",
				})
				.end();
		}
	}
};
