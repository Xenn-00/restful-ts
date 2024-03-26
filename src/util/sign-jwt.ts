import jwt, { Secret } from "jsonwebtoken";

export const accessTokenSign = (payload: {}, secret_key: Secret): string => {
	const token = jwt.sign(payload, secret_key, {
		expiresIn: "15s",
	});

	return token;
};

export const refershTokenSign = (payload: {}, secret_key: Secret): string => {
	const token = jwt.sign(payload, secret_key, {
		expiresIn: "7d",
	});
	return token;
};
