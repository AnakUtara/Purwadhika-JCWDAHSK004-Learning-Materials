import type { Request, Response } from "express";
import UserRepository from "../users/users.repository.ts";
import AuthService from "./auth.service.ts";
import {
	ACCESS_EXPIRES_IN,
	ACCESS_SECRET,
	REFRESH_EXPIRES_IN,
	REFRESH_SECRET,
} from "../../configs/env.config.ts";
import cookieConfig from "../../configs/cookie.config.ts";
import type { AuthPayload } from "../../types/jwt-payload.type.ts";

const AuthController = {
	async signUp(req: Request, res: Response) {
		if (!req.body) throw new Error("[400]: Request body is empty!");

		const { email, password, role } = req.body;

		const hashedPassword = await AuthService.hashPassword(password);

		if (!hashedPassword) throw new Error("[500]: Failed to hash password!");

		await UserRepository.create(email, hashedPassword, role);

		res.status(201).send({
			message: "Sign up success!",
			data: null,
		});
	},
	async signIn(req: Request, res: Response) {
		if (!req.body) throw new Error("[400]: Request body is empty!");

		const { email, password } = req.body;

		const existingUser = await UserRepository.findAuthCredentialsByEmail(email);

		if (!existingUser) throw new Error("[404]: User not found!");

		const comparePassword = await AuthService.comparePassword(
			password,
			existingUser.password || "",
		);

		if (!comparePassword) throw new Error("[400]: Invalid password!");

		const { password: p, ...safeUser } = existingUser;

		const jwtPayload = {
			id: safeUser.id,
			email: safeUser.email,
			role: safeUser.role,
		};

		const accessToken = AuthService.generateToken(
			jwtPayload,
			ACCESS_SECRET,
			ACCESS_EXPIRES_IN,
		);

		const refreshToken = AuthService.generateToken(
			jwtPayload,
			REFRESH_SECRET,
			REFRESH_EXPIRES_IN,
		);

		res.cookie("refresh-token", refreshToken, cookieConfig).send({
			message: "Sign in success!",
			data: {
				user: safeUser,
				accessToken,
			},
		});
	},
	async signOut(req: Request, res: Response) {
		if (!req.auth) throw new Error("[401]: Unauthorized access!");

		res.clearCookie("refresh-token", cookieConfig).send({
			message: "Sign out success!",
			data: null,
		});
	},
	async refreshToken(req: Request, res: Response) {
		const existingRefToken = req.cookies["refresh-token"];

		if (!existingRefToken) throw new Error("[401]: Refresh token not found!");

		const decoded = AuthService.verifyToken(
			existingRefToken,
			REFRESH_SECRET,
		) as AuthPayload;

		if (!decoded) throw new Error("[401]: Refresh token invalid!");

		const { iat, exp, ...payload } = decoded;

		const accessToken = AuthService.generateToken(
			payload,
			ACCESS_SECRET,
			ACCESS_EXPIRES_IN,
		);

		const refreshToken = AuthService.generateToken(
			payload,
			REFRESH_SECRET,
			REFRESH_EXPIRES_IN,
		);

		res.cookie("refresh-token", refreshToken, cookieConfig).send({
			message: "Sign in success!",
			data: {
				accessToken,
			},
		});
	},
	async getAuthCredential(req: Request, res: Response) {
		if (!req.auth) throw new Error("[401]: Unauthorized access!");

		const safeUser = await UserRepository.findById(Number(req.auth.id));

		if (!safeUser) throw new Error("[404]: User not found!");

		res.send({
			message: "Auth credentials retrieved successfully!",
			data: safeUser,
		});
	},

	async googleSignIn(req: Request, res: Response) {
		if (!req.body) throw new Error("[400]: Request body is empty!");

		const { idToken } = req.body;

		if (!idToken) throw new Error("[400]: Google ID token missing");

		const { accessToken, refreshToken, user } =
			await AuthService.googleSignIn(idToken);

		return res.cookie("refresh-token", refreshToken, cookieConfig).send({
			message: "Sign in success!",
			data: {
				accessToken,
				user,
			},
		});
	},
};

export default AuthController;
