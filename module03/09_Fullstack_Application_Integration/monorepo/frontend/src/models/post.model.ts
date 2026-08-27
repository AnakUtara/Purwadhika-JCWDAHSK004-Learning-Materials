import type { TUser } from "@/stores/auth.store";

interface IPost {
	id: number;
	title: string;
	imageUrl?: string;
	content: string;
	authorId: number;
	author: TUser;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

type TPostCreate = Omit<
	IPost,
	"id" | "author" | "createdAt" | "updatedAt" | "deletedAt"
>;

type TPostUpdate = Partial<TPostCreate>;

export type { IPost, TPostCreate, TPostUpdate };
