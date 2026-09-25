import { Router } from "express";
import AuthController from "../modules/auth/auth.controller.ts";
import {
	uniqueUserGuard,
	verifyToken,
} from "../middlewares/auth.middleware.ts";

const authRouter: Router = Router();

authRouter.post("/sign-up", uniqueUserGuard, AuthController.signUp);
authRouter.post("/sign-in", AuthController.signIn);

authRouter.post("/google/callback", AuthController.googleSignIn);

authRouter.post("/refresh-token", AuthController.refreshToken);

// semua rute di bawah ini butuh akses token
authRouter.use(verifyToken("access"));
authRouter.post("/sign-out", AuthController.signOut);
authRouter.get("/credential", AuthController.getAuthCredential);

export default authRouter;
