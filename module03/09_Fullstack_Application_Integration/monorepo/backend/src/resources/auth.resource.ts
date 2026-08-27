import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { requestBodyValidation } from "../middlewares/request-body-validation.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { signInSchema, signUpSchema } from "../validations/auth.schema.js";

const authResource = Router();

authResource.get("/me", authenticate, AuthController.getMe);
authResource.post(
	"/sign-up",
	requestBodyValidation(signUpSchema),
	AuthController.signUp,
);
authResource.post(
	"/sign-in",
	requestBodyValidation(signInSchema),
	AuthController.signIn,
);
authResource.post("/sign-out", authenticate, AuthController.signOut);

export default authResource;
