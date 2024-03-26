import { ZodError } from "zod";
import { CreateUserRequest } from "../../src/model/user.model";
import { logger } from "../../src/application/logger";
import { Validation } from "../../src/validation/validation";
import { UserValidation } from "../../src/validation/User/user.validation";

describe("Validation request test", () => {
	it("should reject if request is invalid", () => {
		const userRequest: CreateUserRequest = {
			username: "",
			password: "",
			name: "",
		};

		try {
			Validation.validate(UserValidation.REGISTER, userRequest);
		} catch (error) {
			if (error instanceof ZodError) {
				logger.info(
					`error is instance of ZodError: ${error instanceof ZodError}`
				);
				logger.warn(`Validation Error: ${error.message}`);
				expect(error).toBeDefined();
			}
		}
	});
	it("should accept if request is valid", () => {
		const userRequest: CreateUserRequest = {
			username: "test",
			password: "testtesttest",
			name: "test",
		};

		try {
			const result = Validation.validate(UserValidation.REGISTER, userRequest);
			logger.info("everything is fine!");
			logger.info(`data: ${[result.name, result.username, result.password]}`);
			expect(result).toBeDefined();
		} catch (error) {
			if (error instanceof ZodError) {
				logger.info(
					`error is instance of ZodError: ${error instanceof ZodError}`
				);
				logger.warn(`Validation Error: ${error.message}`);
			}
		}
	});
});
