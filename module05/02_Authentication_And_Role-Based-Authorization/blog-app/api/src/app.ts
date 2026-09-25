import express, {
	json,
	Router,
	urlencoded,
	type Application,
	type Request,
	type Response,
} from "express";
import cors from "cors";
import appErrorHandler from "./errors/app-error.handler.ts";
import { APP_NAME, CLIENT_URL } from "./configs/env.config.ts";
import authRouter from "./routers/auth.router.ts";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true,
	}),
);

const apiRouter = Router();

apiRouter.get("/", (_req: Request, res: Response) => {
	res.send({
		message: `Welcome to ${APP_NAME}!`,
	});
});

app.use("/api", apiRouter);

// Route declarations
apiRouter.use("/auth", authRouter);

app.use((_req: Request, res: Response) => {
	res.status(404).json({ message: "Not found" });
});

app.use(appErrorHandler);

export default app;
