import type { Request } from "express";
import type { PostWhereInput } from "../generated/prisma/models.js";
import { prisma } from "../libs/prisma.client.js";

class PostsService {
	whereClause: PostWhereInput = { deletedAt: null };

	getAll = async (req: Request) => {
		const { page, limit, ...filters } = req.query;

		const pageNum = Number(page) || 1;
		const limitNum = Number(limit) || 10;
		const skipAmount = (pageNum - 1) * limitNum;

		// Agar data terbaru muncul di halaman pertama secara default, maka kita bisa menggunakan orderBy
		const orderBy = filters.orderBy
			? String(filters.orderBy) === "asc"
				? "asc"
				: "desc"
			: "desc";

		if (filters.search) {
			this.whereClause.OR = [
				{ title: { contains: String(filters.search), mode: "insensitive" } },
			];
		}

		// Relation filter dengan table lain yang memiliki relasi dengan table post, misalnya table user,
		// maka kita bisa menggunakan relation filter untuk memfilter data post berdasarkan data user
		if (filters.authorId || req.user?.id) {
			this.whereClause.authorId = Number(filters.authorId) || req.user?.id;
		}

		const [posts, totalPosts] = await prisma.$transaction([
			prisma.post.findMany({
				where: this.whereClause,
				include: {
					author: {
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
			prisma.post.count({
				where: this.whereClause,
			}),
		]);

		return { posts, totalPosts, pageNum, limitNum };
	};
}

export default new PostsService();
