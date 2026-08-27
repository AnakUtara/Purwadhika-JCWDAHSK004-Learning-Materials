import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import { APP_PORT, CLIENT_URL } from "./src/configs/env.config.js";
import apiRouter from "./src/routes/api.route.js";
import Yup from "./src/libs/yup.js";
import { Prisma } from "./src/generated/prisma/client.js";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
// Mengizinkan request dari frontend dengan origin tertentu dan mengizinkan cookie

app.use("/api", apiRouter);

app.use((_req: Request, res: Response) => {
	res.status(404).send({
		message: "Endpoint tidak ditemukan",
	});
});

app.use(
	(
		error: Error | unknown,
		_req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		if (error instanceof Yup.ValidationError) {
			res.status(400).send({
				message: "Validasi request body gagal",
				error: error.errors,
			});
			return;
		}

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
