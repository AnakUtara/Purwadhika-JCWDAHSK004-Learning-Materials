import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

const app = express();
const appName = process.env.APP_NAME ?? "express-typescript-app";
const port = Number(process.env.APP_PORT ?? 8000);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
	res.json({
		message: `${appName} is running`,
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

app.listen(port, () => {
	console.log(`${appName} listening on port ${port}`);
});
