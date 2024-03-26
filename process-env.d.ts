import { Secret } from "jsonwebtoken";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			ACCESS_TOKEN_SECRET: Secret;
			REFRESH_TOKEN_SECRET: Secret;
		}
	}
}
