import type { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma.client.js";
import type { IBaseControllerSoftDelete } from "../interfaces/base-controller.interface.js";
import postsService from "../services/posts.service.js";

const PostsController: IBaseControllerSoftDelete = {
	async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { page, limit } = req.query;
			const { posts, totalPosts, limitNum, pageNum } =
				await postsService.getAll(req);

			res.send({
				message: "Posts retrieved successfully!",
				data: posts,
				meta: {
					currentPage: page ? pageNum : 0,
					limit: limit ? limitNum : page ? 10 : 0,
					totalPages: Math.ceil(totalPosts / limitNum),
					totalPosts,
				},
			});
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
			const post = await prisma.post.findFirst({
				where: { id: Number(id), deletedAt: null },
				include: {
					author: {
						omit: {
							password: true,
						},
					},
				},
			});

			if (!post) {
				throw new Error(`Post with id ${id} not found`);
			}

			res.send({
				message: "Post retrieved successfully!",
				data: post,
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

			await prisma.post.create({
				data: {
					...req.body,
					authorId: req.user.id,
				},
			});

			res.status(201).send({
				message: "Post created successfully!",
			});
		} catch (error) {
			next(error);
		}
	},

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const updatedPost = await prisma.post.update({
				where: { id: Number(id), deletedAt: null },
				data: req.body,
			});

			if (!updatedPost) {
				throw new Error(`Post with id ${id} not found`);
			}

			res.send({
				message: "Post updated successfully!",
				data: updatedPost,
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

			const restoredPost = await prisma.post.update({
				where: { id: Number(id), deletedAt: { not: null } },
				data: { deletedAt: null },
			});

			res.send({
				message: "Post restored successfully!",
				data: restoredPost,
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
				await prisma.post.delete({
					where: { id: Number(id) },
				});

				res.send({
					message: "Post permanently deleted successfully!",
				});

				return;
			}

			await prisma.post.update({
				where: { id: Number(id), deletedAt: null },
				data: { deletedAt: new Date() },
			});

			res.send({
				message: "Post soft deleted successfully!",
			});
		} catch (error) {
			next(error);
		}
	},
};

export default PostsController;
