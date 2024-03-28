import winston from "winston";

const customFormat = winston.format.printf(
	(log) =>
		`[${log.timestamp}] -> [${log.level}] : ${JSON.stringify(log.message)}`
);

export const logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
		winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
		winston.format.colorize(),
		customFormat
	),
	transports: [new winston.transports.Console({})],
});
