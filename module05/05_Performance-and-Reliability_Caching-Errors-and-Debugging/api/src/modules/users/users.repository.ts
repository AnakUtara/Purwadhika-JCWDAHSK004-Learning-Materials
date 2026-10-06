import prisma from "../../db/client.ts";
import type {
	PrismaClient,
	Role,
	User,
} from "../../generated/prisma/client.ts";

export type SafeUser = Omit<User, "password">;

const UserRepository = {
	// For public
	findById: async (id: number): Promise<SafeUser | null> => {
		return await prisma.user.findUnique({
			where: { id },
		});
	},

	// For password check
	findAuthCredentialsByEmail: async (email: string): Promise<User | null> => {
		return await prisma.user.findUnique({
			where: { email },
			omit: { password: false },
		});
	},

	oAuthUpsert: async (
		email: string,
		role: Role,
		provider: string,
		providerAccountId: string,
	) => {
		const oAuthUser = await prisma.$transaction(async (tx) => {
			const user = await tx.user.upsert({
				where: { email },
				update: {},
				create: {
					email,
					role,
				},
			});

			await tx.account.upsert({
				where: { provider_providerAccountId: { provider, providerAccountId } },
				update: {},
				create: {
					user: {
						connect: {
							id: user.id,
						},
					},
					provider,
					providerAccountId,
				},
			});

			return user;
		});

		return oAuthUser;
	},

	create: async (email: string, password: string, role?: Role) => {
		await prisma.user.create({
			data: {
				email,
				password,
				role,
			},
		});
	},
};

export default UserRepository;
