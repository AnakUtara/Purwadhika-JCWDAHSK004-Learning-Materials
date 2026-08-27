import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";
import type { IBaseControllerSoftDelete } from "../interfaces/base-controller.interface.js";
import type { TaskWhereInput } from "../generated/prisma/models.js";

const TasksController: IBaseControllerSoftDelete = {
	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { page, limit, ...filters } = req.query;

			const pageNum = Number(page) || 1;
			const limitNum = Number(limit) || 10;
			const skipAmount = (pageNum - 1) * limitNum;

			const whereClause: TaskWhereInput = {
				deletedAt: null,
			};

			const orderBy = filters.orderBy
				? String(filters.orderBy) === "asc"
					? "asc"
					: "desc"
				: "desc";

			if (filters.search) {
				whereClause.OR = [
					{ name: { contains: String(filters.search), mode: "insensitive" } },
				];
			}

			if (filters.userId || req.user?.id) {
				whereClause.userId = Number(filters.userId) || req.user?.id;
			}

			try {
				const [tasks, totalTasks] = await prisma.$transaction([
					prisma.task.findMany({
						where: whereClause,
						include: {
							user: {
								omit: {
									password: true,
								},
							},
						},
						skip: page ? skipAmount : undefined,
						take: limit ? limitNum : undefined,
						orderBy: {
							id: orderBy,
						},
					}),
					prisma.task.count({
						where: whereClause,
					}),
				]);

				res.send({
					message: "Tasks retrieved successfully!",
					data: tasks,
					meta: {
						currentPage: page ? pageNum : 0,
						limit: limit ? limitNum : page ? 10 : 0,
						totalPages: Math.ceil(totalTasks / limitNum),
						totalTasks,
					},
				});
			} catch (error) {
				next(error);
			}
		} catch (error) {
			next(error);
		}
	},

	async getById(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;
			const task = await prisma.task.findFirst({
				where: { id: Number(id), deletedAt: null },
				include: {
					user: {
						omit: {
							password: true,
						},
					},
				},
			});

			if (!task) {
				throw new Error(`Task with id ${id} not found`);
			}

			res.send({
				message: "Task retrieved successfully!",
				data: task,
			});
		} catch (error) {
			next(error);
		}
	},

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (!req.user) {
				throw new Error("User not authenticated");
			}

			await prisma.task.create({
				data: {
					...req.body,
					userId: req.user.id,
				},
			});

			res.status(201).send({
				message: "Task created successfully!",
			});
		} catch (error) {
			next(error);
		}
	},

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const updatedTask = await prisma.task.update({
				where: { id: Number(id), deletedAt: null },
				data: req.body,
			});

			if (!updatedTask) {
				throw new Error(`Task with id ${id} not found`);
			}

			res.send({
				message: "Task updated successfully!",
				data: updatedTask,
			});
		} catch (error) {
			next(error);
		}
	},

	async restore(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { id } = req.params;

			const restoredTask = await prisma.task.update({
				where: { id: Number(id), deletedAt: { not: null } },
				data: { deletedAt: null },
			});

			res.send({
				message: "Task restored successfully!",
				data: restoredTask,
			});
		} catch (error) {
			next(error);
		}
	},

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const { hard } = req.query;

			if (hard && String(hard) === "true") {
				await prisma.task.delete({
					where: { id: Number(id) },
				});

				res.send({
					message: "Task permanently deleted successfully!",
				});

				return;
			}

			await prisma.task.update({
				where: { id: Number(id), deletedAt: null },
				data: { deletedAt: new Date() },
			});

			res.send({
				message: "Task soft deleted successfully!",
			});
		} catch (error) {
			next(error);
		}
	},
};

export default TasksController;
