import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";

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
};

export default SessionController;
