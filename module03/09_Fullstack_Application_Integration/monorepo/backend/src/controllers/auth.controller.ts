import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";
import type { User } from "../generated/prisma/client.js";
import AuthService from "../services/auth.service.js";
import UsersService from "../services/users.service.js";

const AuthController = {
	async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			// Hash password before storing
			const hashedPassword = await AuthService.hashPassword(password);

			await UsersService.create({
				email,
				password: hashedPassword,
			});

			res.status(201).send({
				message: "User created successfully!",
			});
		} catch (error) {
			next(error);
		}
	},

	async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;

			const user: User | null = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new Error("User not found");
			}

			// Compare password with hashed password
			const isPasswordMatch = await AuthService.comparePassword(
				password,
				user.password,
			);

			if (!isPasswordMatch) {
				throw new Error("Invalid password");
			}

			// Generate access token
			const { password: p, ...cleanUser } = user;

			const accessToken = AuthService.generateAccessToken(
				cleanUser as Omit<User, "password">,
			);

			res.send({
				message: "User signed in successfully!",
				data: {
					user: cleanUser,
					accessToken,
				},
			});
		} catch (error) {
			next(error);
		}
	},

	async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			// User is already attached to request by authenticate middleware
			const user = req.user;

			if (!user) {
				throw new Error("User not authenticated");
			}

			const userWithPosts = await prisma.user.findUniqueOrThrow({
				where: { id: user.id },
				include: { posts: true, tasks: true },
				omit: { password: true },
			});

			res.send({
				message: "User retrieved successfully!",
				data: userWithPosts,
			});
		} catch (error) {
			next(error);
		}
	},

	async signOut(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			// signOut in JWT-based auth is typically handled on client-side
			// by deleting the token from localStorage/sessionStorage
			// However, you can add additional server-side logic here if needed
			// such as invalidating tokens in a blacklist

			res.send({
				message: "User signed out successfully!",
			});
		} catch (error) {
			next(error);
		}
	},
};

export default AuthController;
