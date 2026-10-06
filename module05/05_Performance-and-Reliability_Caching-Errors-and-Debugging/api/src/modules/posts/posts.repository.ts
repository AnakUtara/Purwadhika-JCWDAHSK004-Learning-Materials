import prisma from "../../db/client.ts";
import type { Role } from "../../generated/prisma/enums.ts";
import type {
	PostCreateInput,
	PostInclude,
	PostUpdateInput,
	PostWhereInput,
} from "../../generated/prisma/models.ts";

export type FindAllQueryParams = {
	skip: number;
	take: number;
	search: string;
	roleFilter?: Role;
	authorId?: number;
	// Tambah dengan filter baru seperlunya
};

const postsInclude: PostInclude = {
	author: {
		omit: {
			password: true,
		},
	},
};

const PostsRepository = {
	async findAll(params: FindAllQueryParams, withTrash: boolean = false) {
		const { skip, take, search, roleFilter } = params;

		let where: PostWhereInput = {};

		if (!withTrash) {
			where.deletedAt = null;
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ content: { contains: search, mode: "insensitive" } },
			];
		}

		if (roleFilter) {
			where.author = { role: roleFilter };
		}

		const [items, total] = await Promise.all([
			prisma.post.findMany({
				where,
				skip,
				take,
				orderBy: { createdAt: "desc" },
				include: postsInclude,
			}),
			prisma.post.count({ where }),
		]);

		return { items, total };
	},
	async findById(id: string) {
		return await prisma.post.findUnique({
			where: { id },
			include: postsInclude,
		});
	},
	async create(data: PostCreateInput) {
		return await prisma.post.create({
			data,
		});
	},
	async update(id: string, data: PostUpdateInput) {
		return await prisma.post.update({
			where: { id },
			data,
		});
	},
	async softDelete(id: string) {
		await prisma.post.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	},
	async restore(id: string) {
		await prisma.post.update({
			where: { id },
			data: { deletedAt: null },
		});
	},
	async hardDelete(id: string) {
		await prisma.post.delete({
			where: { id },
		});
	},
};

export default PostsRepository;
