import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import { APP_NAME, APP_PORT, CLIENT_ORIGIN_URL } from "./configs/env.config";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: CLIENT_ORIGIN_URL,
	}),
);

app.get("/", (_req: Request, res: Response) => {
	res.json({
		message: `${APP_NAME} is running`,
	});
});

app.use((_req: Request, res: Response) => {
	res.status(404).json({
		message: "Route not found",
	});
});

app.use(
	(error: Error, _req: Request, response: Response, _next: NextFunction) => {
		console.error(error);

		response.status(500).json({
			message: "Internal server error",
		});
	},
);

app.listen(APP_PORT, () => {
	console.log(`${APP_NAME} listening on port ${APP_PORT}`);
});
