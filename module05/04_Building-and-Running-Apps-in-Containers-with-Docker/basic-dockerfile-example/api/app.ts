import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

const PORT = 5000;
const HOST = "0.0.0.0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
	}),
);

app.get("/api", (_req: Request, res: Response) => {
	res.send("Welcome to the Basic Dockerfile Example API!");
});

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
