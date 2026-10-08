import type { Request, Response } from "express";
import UserRepository from "../users/users.repository.ts";
import AuthService from "./auth.service.ts";
import {
	ACCESS_EXPIRES_IN,
	ACCESS_SECRET,
	CLIENT_URL,
	REFRESH_EXPIRES_IN,
	REFRESH_SECRET,
} from "../../configs/env.config.ts";
import cookieConfig from "../../configs/cookie.config.ts";
import type { AuthPayload } from "../../types/jwt-payload.type.ts";
import AppError from "../../errors/app.error.ts";

import EmailService from "../email/email.service.ts";
import renderTemplate from "../../libs/handlebars.ts";
import redis from "../../libs/redis.ts";
import { emailQueue } from "../../queues/queue-manager.ts";

// create refresh token cache key
const getCacheKey = (userId: string) => `auth:refresh:${userId}`;
const DAY = 24 * 60 * 60; // seconds in a day

const AuthController = {
	async signUp(req: Request, res: Response) {
		const { email, password, role } = req.body;

		const hashedPassword = await AuthService.hashPassword(password);

		if (!hashedPassword) throw new AppError("Failed to hash password!", 500);

		await UserRepository.create(email, hashedPassword, role);

		await emailQueue.add("sign-up-email-notification", {
			email,
			clientUrl: CLIENT_URL,
			year: new Date().getFullYear(),
		});

		res.status(201).send({
			message: "Sign up success!",
			data: null,
		});
	},
	async signIn(req: Request, res: Response) {
		const { email, password } = req.body;

		const existingUser = await UserRepository.findAuthCredentialsByEmail(email);

		if (!existingUser) throw new AppError("User not found!", 404);

		const comparePassword = await AuthService.comparePassword(
			password,
			existingUser.password || "",
		);

		if (!comparePassword) throw new AppError("Invalid password!", 400);

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

		// set refresh token in cookie & set to redis, ttl set to same as refresh token expiration time

		await redis.setex(
			getCacheKey(safeUser.id.toString()),
			7 * DAY,
			refreshToken,
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
		if (!req.auth) throw new AppError("Unauthorized access!", 401);

		await redis.del(getCacheKey(req.auth.id.toString()));

		res.clearCookie("refresh-token", cookieConfig).send({
			message: "Sign out success!",
			data: null,
		});
	},
	async refreshToken(req: Request, res: Response) {
		const existingRefToken = req.cookies["refresh-token"];

		if (!existingRefToken) throw new AppError("Refresh token not found!", 401);

		const decoded = AuthService.verifyToken(
			existingRefToken,
			REFRESH_SECRET,
		) as AuthPayload;

		const cachedRefToken = await redis.get(getCacheKey(decoded.id.toString()));

		if (!cachedRefToken || cachedRefToken !== existingRefToken) {
			if (decoded?.id) await redis.del(getCacheKey(decoded.id.toString()));

			res.clearCookie("refresh-token", cookieConfig);

			throw new AppError("Invalid refresh token!", 401);
		}

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

		await redis.setex(
			getCacheKey(decoded.id.toString()),
			7 * DAY,
			refreshToken,
		);

		res.cookie("refresh-token", refreshToken, cookieConfig).send({
			message: "Token refreshed successfully!",
			data: {
				accessToken,
			},
		});
	},
	async getAuthCredential(req: Request, res: Response) {
		const safeUser = await UserRepository.findById(Number(req.auth.id));

		if (!safeUser) throw new AppError("User not found!", 404);

		res.send({
			message: "Auth credentials retrieved successfully!",
			data: safeUser,
		});
	},

	async googleSignIn(req: Request, res: Response) {
		if (!req.body) throw new AppError("Request body is empty!", 400);

		const { idToken } = req.body;

		if (!idToken) throw new AppError("Google ID token missing", 400);

		const { accessToken, refreshToken, user } =
			await AuthService.googleSignIn(idToken);

		await redis.setex(getCacheKey(user.id.toString()), 7 * DAY, refreshToken);

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
