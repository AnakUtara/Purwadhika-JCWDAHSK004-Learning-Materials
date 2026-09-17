import express, {
	Router,
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import {
	APP_PORT,
	CLIENT_URL,
	OPENROUTER_MODEL,
} from "./src/configs/env.config.js";
import { Prisma } from "./src/generated/prisma/client.js";
import cors from "cors";
import sessionsRouter from "./src/routers/sessions.router.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: CLIENT_URL,
	}),
);

const apiRouter = Router();

app.use("/api", apiRouter);

apiRouter.use("/sessions", sessionsRouter);

app.use((_req: Request, res: Response) => {
	res.status(404).send({
		message: "Endpoint tidak ditemukan",
	});
});

// Application level error handling
app.use(
	(
		error: Error | unknown,
		_req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			res.status(400).send({
				message: "Terjadi error pada database",
				error: error.message,
			});
			return;
		}

		res.status(500).send({
			message: "Terjadi error pada server",
			error: error instanceof Error ? error.message : error,
		});
	},
);

app.listen(APP_PORT, () => {
	console.log(`Server is running on port ${APP_PORT}`);
});

export default app;
