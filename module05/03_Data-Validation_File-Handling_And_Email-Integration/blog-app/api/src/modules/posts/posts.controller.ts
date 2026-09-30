import type { Request, Response } from "express";
import PostsService from "./posts.service.ts";
import type { Role } from "../../generated/prisma/enums.ts";

const PostsController = {
	getAll: async (req: Request, res: Response) => {
		const { page, limit, search, role } = req.query;
		const { data, meta } = await PostsService.getPaginatedPosts({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search: search?.toString() || "",
			role: role as Role,
		});
		res.send({
			message: "Posts retrieved successfully!",
			data,
			meta,
		});
	},
	getAllByAuthor: async (req: Request, res: Response) => {
		const { id } = req.auth;
		const { page, limit, search } = req.query;
		const { data, meta } = await PostsService.getPaginatedPosts({
			page: Number(page) || 1,
			limit: Number(limit) || 10,
			search: search?.toString() || "",
			authorId: Number(id),
		});
		res.send({
			message: "Posts retrieved successfully!",
			data,
			meta,
		});
	},
	getById: async (req: Request, res: Response) => {
		const { id } = req.params;
		const post = await PostsService.getById(id.toString());
		res.send({
			message: "Post retrieved successfully!",
			data: post,
		});
	},
	create: async (req: Request, res: Response) => {
		const { id } = req.auth;
		const post = await PostsService.create({
			...req.body,
			author: {
				connect: { id },
			},
		});
		res.status(201).send({
			message: "Post created successfully!",
			data: post,
		});
	},
	update: async (req: Request, res: Response) => {
		const { id } = req.params;
		const post = await PostsService.update(id.toString(), req.body);
		res.send({
			message: "Post updated successfully!",
			data: post,
		});
	},
	delete: async (req: Request, res: Response) => {
		const { id } = req.params;
		const { mode } = req.query;

		switch (mode) {
			case "soft":
				await PostsService.softDelete(id.toString());
				break;
			case "hard":
				await PostsService.hardDelete(id.toString());
				break;
			default:
				await PostsService.softDelete(id.toString());
		}

		res.send({
			message: `Post ${mode} deleted successfully!`,
		});
	},
	restore: async (req: Request, res: Response) => {
		const { id } = req.params;
		await PostsService.restore(id.toString());
		res.send({
			message: "Post restored successfully!",
		});
	},
};

export default PostsController;
