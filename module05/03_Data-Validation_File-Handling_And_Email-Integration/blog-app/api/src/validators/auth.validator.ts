import z from "zod";
import { Role } from "../generated/prisma/enums.ts";

const sharedAuthSchema = {
	email: z
		.email("Email is invalid")
		.min(5, "Email must be at least 5 characters")
		.max(255, "Email must be at most 255 characters"),
	password: z
		.string()
		.min(6, "Password must be at least 6 character")
		.max(255, "Password must be at most 255 characters"),
};

export const signInSchema = z.object(sharedAuthSchema);

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
	...sharedAuthSchema,
	role: z.enum(Role).default(Role.READER),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
