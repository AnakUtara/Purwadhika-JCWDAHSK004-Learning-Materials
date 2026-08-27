import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { prisma } from "../libs/prisma.client.js";

const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization; // isinya: Bearer <token>

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new Error("No authorization token provided");
		}

		const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

		const decoded = AuthService.verifyAccessToken(token);

		if (!decoded) {
			throw new Error("Invalid or expired token");
		}

		const user = await prisma.user.findUniqueOrThrow({
			where: { id: decoded.id, deletedAt: null },
			omit: { password: true },
		});

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export { authenticate };
