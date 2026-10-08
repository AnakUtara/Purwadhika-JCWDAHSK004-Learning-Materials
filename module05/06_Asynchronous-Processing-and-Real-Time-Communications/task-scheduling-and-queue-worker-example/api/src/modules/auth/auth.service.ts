import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import {
	ACCESS_EXPIRES_IN,
	ACCESS_SECRET,
	GOOGLE_AUTH_CLIENT_ID,
	REFRESH_EXPIRES_IN,
	REFRESH_SECRET,
	SALT_ROUNDS,
} from "../../configs/env.config.ts";
import { OAuth2Client } from "google-auth-library";
import UserRepository from "../users/users.repository.ts";
import type { AuthPayload } from "../../types/jwt-payload.type.ts";

const googleAuthClient: OAuth2Client = new OAuth2Client(GOOGLE_AUTH_CLIENT_ID);

const AuthService = {
	async hashPassword(password: string) {
		return await bcrypt.hash(password, Number(SALT_ROUNDS));
	},

	async comparePassword(password: string, hashedPassword: string) {
		return await bcrypt.compare(password, hashedPassword);
	},
	generateToken(payload: JwtPayload, secret: string, expiresIn: string = "1h") {
		return jwt.sign(payload, secret, { expiresIn } as SignOptions);
	},
	verifyToken(token: string, secret: string) {
		return jwt.verify(token, secret);
	},
	async googleSignIn(idToken: string) {
		const ticket = await googleAuthClient.verifyIdToken({
			idToken,
			audience: GOOGLE_AUTH_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload?.email || !payload.sub) {
			throw new Error("[401]: Invalid credentials");
		}

		const { email, sub: providerAccountId } = payload;

		const user = await UserRepository.oAuthUpsert(
			email,
			"READER",
			"google",
			providerAccountId,
		);

		if (!user) {
			throw new Error("[400]: Fail to create user");
		}

		const jwtPayload: AuthPayload = {
			id: user.id.toString(),
			email: user.email,
			role: user.role,
		};

		const accessToken = this.generateToken(
			jwtPayload,
			ACCESS_SECRET,
			ACCESS_EXPIRES_IN,
		);

		const refreshToken = this.generateToken(
			jwtPayload,
			REFRESH_SECRET,
			REFRESH_EXPIRES_IN,
		);

		return {
			accessToken,
			refreshToken,
			user,
		};
	},
};

export default AuthService;
