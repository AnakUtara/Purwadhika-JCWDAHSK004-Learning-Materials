import express, {
	json,
	Router,
	urlencoded,
	type Application,
	type Request,
	type Response,
} from "express";
import cors from "cors";
import appErrorHandler, {
	errorNormalizer,
} from "./errors/app-error.handler.ts";
import { APP_NAME, CLIENT_URL } from "./configs/env.config.ts";
import authRouter from "./routers/auth.router.ts";
import cookieParser from "cookie-parser";
import storageRouter from "./routers/storage.router.ts";
import postsRouter from "./routers/posts.router.ts";
import cronRunner from "./cron/runner.ts";
import "./workers/email.worker.ts";

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

cronRunner();

const apiRouter = Router();

apiRouter.get("/", (_req: Request, res: Response) => {
	res.send({
		message: `Welcome to ${APP_NAME}!`,
	});
});

app.use("/api", apiRouter);

// Route declarations
apiRouter.use("/auth", authRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/storage", storageRouter);

app.use((_req: Request, res: Response) => {
	res.status(404).json({ message: "Not found" });
});

app.use(errorNormalizer, appErrorHandler);

export default app;
