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
import SessionController from "./src/controllers/session.controller.js";
import {
	pipeUIMessageStreamToResponse,
	streamText,
	toUIMessageStream,
	type ModelMessage,
} from "ai";
import openRouter from "./src/libs/openrouter.js";
import { prisma } from "./src/libs/prisma.client.js";
import cors from "cors";

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

apiRouter.get("/sessions", SessionController.getAll);
apiRouter.post("/sessions", SessionController.create);
apiRouter.get("/sessions/:id", SessionController.getById);

apiRouter.post(
	"/sessions/:id/messages",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { messages, model = OPENROUTER_MODEL } = req.body;
			const { id } = req.params;

			const normalizedMessages = messages.map((msg: any) => ({
				role: msg.role,
				content: msg.parts?.[0]?.text || msg.content || "",
			}));

			const result = streamText({
				model: openRouter(model),
				messages: normalizedMessages as ModelMessage[],
				onEnd: async ({ text }) => {
					try {
						console.log(text);
						await prisma.$transaction([
							prisma.message.create({
								data: {
									content:
										normalizedMessages[normalizedMessages.length - 1].content,
									role: "user",
									sessionId: id.toString(),
								},
							}),
							prisma.message.create({
								data: {
									content: text,
									role: "assistant",
									sessionId: id.toString(),
								},
							}),
						]);
					} catch (error) {
						console.error("Error saving messages to database:", error);
					}
				},
			});

			pipeUIMessageStreamToResponse({
				response: res,
				stream: toUIMessageStream({ stream: result.stream }),
			});
		} catch (error) {
			next(error);
		}
	},
);

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
