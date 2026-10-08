import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";
import logger from "../utils/logger.js";

const routeNotFoundHandler = (_req: Request, res: Response) => {
	res.status(404).json({ message: "Route not found" });
};

const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const logMessage = `${req.method} ${req.originalUrl} : ${error.message}`;

	logger.error(logMessage, {
		statusCode: error instanceof AppError ? error.statusCode : 500,
		isOperational: error instanceof AppError ? error.isOperational : false,
	});

	console.error(
		`❌ [ERROR HANDLER] ${error.name}: ${error.message} | Stack: ${error.stack}`,
	);

	if (error instanceof AppError) {
		return res.status(error.statusCode).send({ message: error.message });
	}

	return res.status(500).send({
		message: "Internal server error",
		details: error.message || "Something went wrong",
	});
};

export default errorHandler;
export { routeNotFoundHandler };
