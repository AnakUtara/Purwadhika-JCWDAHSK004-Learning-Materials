import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";
import { OPENROUTER_MODEL } from "../configs/env.config.js";
import {
	streamText,
	pipeUIMessageStreamToResponse,
	type ModelMessage,
	toUIMessageStream,
} from "ai";
import openRouter from "../libs/openrouter.js";

const SessionController = {
	async getAll(_req: Request, res: Response, next: NextFunction) {
		try {
			const sessions = await prisma.chatSession.findMany();
			res.send({
				message: "Berhasil mendapatkan semua sesi chat",
				data: sessions,
			});
		} catch (error) {
			next(error);
		}
	},

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const session = await prisma.chatSession.findUnique({
				where: { id: id.toString() },
			});
			res.send({
				message: "Berhasil mendapatkan sesi chat",
				data: session,
			});
		} catch (error) {
			next(error);
		}
	},

	async create(_req: Request, res: Response, next: NextFunction) {
		try {
			const session = await prisma.chatSession.create({});
			res.send({
				message: "Berhasil membuat sesi chat baru",
				data: session,
			});
		} catch (error) {
			next(error);
		}
	},

	async getMessagesBySessionId(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { id } = req.params;
			const messages = await prisma.message.findMany({
				where: { sessionId: id.toString() },
			});
			res.send({
				message: "Berhasil mendapatkan pesan dari sesi chat",
				data: messages,
			});
		} catch (error) {
			next(error);
		}
	},

	async addMessages(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const existingSession = await prisma.chatSession.findUnique({
				where: { id: id.toString() },
			});

			if (!existingSession) {
				throw new Error("Sesi tidak ditemukan");
			}

			const { messages, model = OPENROUTER_MODEL } = req.body;

			const normalizedMessages = messages.map((message: any) => ({
				role: message.role,
				content: message.parts?.[0]?.text || message.content || "",
			}));

			const result = streamText({
				model: openRouter(model),
				messages: normalizedMessages as ModelMessage[],
				onEnd: async ({ text }) => {
					try {
						await prisma.$transaction([
							prisma.message.create({
								data: {
									role: "user",
									content:
										normalizedMessages[normalizedMessages.length - 1].content,
									session: {
										connect: { id: id.toString() },
									},
								},
							}),
							prisma.message.create({
								data: {
									role: "assistant",
									content: text,
									session: {
										connect: { id: id.toString() },
									},
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
};

export default SessionController;
