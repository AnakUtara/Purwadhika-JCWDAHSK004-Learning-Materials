import type { NextFunction, Request, Response } from "express";
import UserRepository from "../modules/users/users.repository.ts";
import type { Role } from "../generated/prisma/enums.ts";
import AuthService from "../modules/auth/auth.service.ts";
import { ACCESS_SECRET, REFRESH_SECRET } from "../configs/env.config.ts";
import type { AuthPayload } from "../types/jwt-payload.type.ts";

export const uniqueUserGuard = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const { email } = req.body;

	const existingUser = await UserRepository.findAuthCredentialsByEmail(email);

	if (existingUser) throw new Error("[400]: User already exists!");

	next();
};

export const verifyToken =
	// Ini di-keep sebagai closure untuk akomodir secret2 lain selain refresh seperti: reset password & email verification
	(type: "access" | "refresh") =>
		async (req: Request, _res: Response, next: NextFunction) => {
			let appliedSecret: string = "";

			switch (type) {
				case "access":
					appliedSecret = ACCESS_SECRET;
					break;
				case "refresh":
					appliedSecret = REFRESH_SECRET;
					break;
			}

			const clientToken = req.headers.authorization?.split(" ")[1] || "";

			if (!clientToken) throw new Error("[404]: Access token not found!");

			const decoded = AuthService.verifyToken(clientToken, appliedSecret);

			if (!decoded) throw new Error("[404]: Access token invalid!");

			req.auth = decoded as AuthPayload;

			next();
		};

export const roleGuard =
	(role: Role) => async (req: Request, _res: Response, next: NextFunction) => {
		if (!req.auth) throw new Error("[404]: Authenticated payload not found!");

		if (req.auth.role !== role) throw new Error("[401]: Unauthorized access!");

		next();
	};
