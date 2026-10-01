import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { APP_HOST, APP_PORT } from "./src/configs/env.config.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
	}),
);

app.get("/api", (_req: Request, res: Response) => {
	res.send("Welcome to the Docker Composed Example API!");
});

app.listen(Number(APP_PORT), APP_HOST, () => {
	console.log(`Server is running on http://${APP_HOST}:${APP_PORT}`);
});
