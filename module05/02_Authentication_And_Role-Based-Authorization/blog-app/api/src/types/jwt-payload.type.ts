import type { JwtPayload } from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.ts";

export interface AuthPayload extends JwtPayload {
	id: string;
	email: string;
	role: Role;
}
