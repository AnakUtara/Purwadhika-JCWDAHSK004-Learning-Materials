import type { Request } from "express";
import { Role } from "../../generated/prisma/enums.js";
import PostsRepository from "./posts.repository.ts";
import type {
	PostCreateInput,
	PostUpdateInput,
} from "../../generated/prisma/models.ts";

const PostsService = {
	async getPaginatedPosts(query: {
		page?: number;
		limit?: number;
		search?: string;
		role?: Role;
		authorId?: number;
	}) {
		// 1. Business Logic: Sanitize, defaults, and bounds
		const page = Math.max(1, Number(query.page) || 1);
		const limit = Math.min(50, Math.max(1, Number(query.limit) || 10)); // Clamp max to 50
		const skip = (page - 1) * limit;

		// 2. Delegate data fetching to Repository
		const { items, total } = await PostsRepository.findAll({
			skip,
			take: limit,
			search: query.search?.trim() || "",
			roleFilter: query.role || undefined,
			...(query.authorId && { authorId: query.authorId }),
		});

		// 3. Construct Pagination Response Object
		const totalPages = Math.ceil(total / limit);

		return {
			data: items,
			meta: {
				page,
				limit,
				totalItems: total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		};
	},
	async getAll(req: Request) {
		return await PostsService.getPaginatedPosts({
			page: Number(req.query.page) || 1,
			limit: Number(req.query.limit) || 10,
			search: req.query.search?.toString() || "",
			role: req.auth?.role,
		});
	},
	async getById(id: string) {
		return await PostsRepository.findById(id);
	},
	async create(data: PostCreateInput) {
		return await PostsRepository.create(data);
	},
	async update(id: string, data: PostUpdateInput) {
		return await PostsRepository.update(id, data);
	},
	async softDelete(id: string) {
		await PostsRepository.softDelete(id);
	},
	async restore(id: string) {
		await PostsRepository.restore(id);
	},
	async hardDelete(id: string) {
		await PostsRepository.hardDelete(id);
	},
};

export default PostsService;
