import { z, ZodType } from "zod";

export class UserValidation {
	static readonly REGISTER: ZodType = z.object({
		username: z.string().min(1).max(100),
		password: z.string().min(8).max(256),
		name: z.string().min(1).max(100),
	});

	static readonly LOGIN: ZodType = z.object({
		username: z.string().min(1).max(100),
		password: z.string().min(1).max(256),
	});

	static readonly UPDATE: ZodType = z.object({
		username: z.string().min(1).max(100).optional(),
		password: z.string().min(8).max(256).optional(),
		name: z.string().min(1).max(100).optional(),
	});
}
