import type { NextFunction, Request, Response } from "express";

const appErrorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	res.status(500).json({ message: error.message });
};

export default appErrorHandler;
