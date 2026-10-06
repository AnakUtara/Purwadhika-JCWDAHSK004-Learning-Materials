import type { AuthPayload } from "./jwt-payload.type.ts";

declare module "express-serve-static-core" {
	interface Request {
		auth: AuthPayload;
	}
}
