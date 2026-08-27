import type { NextFunction, Request, Response } from "express";
import type { AnyObjectSchema } from "yup";

const requestBodyValidation =
	(schema: AnyObjectSchema) =>
	async (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.body = await schema.validate(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};

export { requestBodyValidation };
