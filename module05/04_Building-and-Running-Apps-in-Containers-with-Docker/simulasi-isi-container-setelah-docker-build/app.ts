import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// In a containerized environment, we often use "
const PORT = 3000; // This is the exposed port for the internal container port
const HOST = "0.0.0.0"; // This is the "Magic" address

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
