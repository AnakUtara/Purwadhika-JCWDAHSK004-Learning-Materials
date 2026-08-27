import bcrypt from "../libs/bcrypt.js";
import jwt from "../libs/jwt.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../configs/env.config.js";
import type { User } from "../generated/prisma/client.js";
import type { SignOptions } from "jsonwebtoken";
import type { TokenPayload } from "../interfaces/token-payload.interface.js";

const AuthService = {
	async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		return bcrypt.hash(password, saltRounds);
	},

	async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	},

	generateAccessToken(user: Omit<User, "password">): string {
		const payload: TokenPayload = {
			id: user.id,
			email: user.email,
		};

		return jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		} as SignOptions);
	},

	verifyAccessToken(token: string): TokenPayload | null {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
			return decoded;
		} catch (error) {
			return null;
		}
	},
};

export default AuthService;
