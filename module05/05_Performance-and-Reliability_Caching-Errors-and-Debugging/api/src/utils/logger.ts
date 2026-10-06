import { createLogger, format, transports } from "winston";
import path from "path";
import { IS_PROD } from "../configs/env.config.ts";

const logFormat = format.printf(
	({ level, message, timestamp, ...metadata }) => {
		const meta =
			metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : "";
		return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
	},
);

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.errors({ stack: true }),
		format.splat(),
		format.json(),
		logFormat,
	),
	transports: [
		new transports.File({
			level: "error",
			filename: path.join(process.cwd(), "src/logs/error.log"),
		}),
		new transports.File({
			filename: path.join(process.cwd(), "src/logs/combined.log"),
		}),
	],
});

if (!IS_PROD) {
	logger.add(
		new transports.Console({
			format: format.combine(format.colorize(), logFormat),
		}),
	);
}

export default logger;
