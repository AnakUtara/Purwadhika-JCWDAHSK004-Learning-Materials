import type { UserCreateInput } from "../generated/prisma/models.js";
import { prisma } from "../libs/prisma.client.js";

const UsersService = {
	async getAll() {
		return await prisma.user.findMany();
	},
	async create(data: UserCreateInput) {
		await prisma.user.create({
			data,
		});
	},
};

export default UsersService;
