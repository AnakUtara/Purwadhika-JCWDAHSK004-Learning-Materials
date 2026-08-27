import apiAuth, { apiStatic } from "@/configs/api.config";
import type { IPost } from "@/models/post.model";
import type { TPostCreate } from "@/validations/post.validation";

const PostService = {
	async getAll({
		search,
		authorId,
		page,
		limit,
	}: {
		search?: string;
		authorId?: number;
		page?: number;
		limit?: number;
	}): Promise<{
		data: IPost[];
		meta: {
			currentPage: number;
			totalPages: number;
			limit: number;
			totalItems: number;
		};
	}> {
		const res = await apiStatic.get("/posts", {
			params: { search, authorId, page, limit },
		});
		const data = res.data;
		return data;
	},
	async getById(id: number): Promise<IPost> {
		const res = await apiStatic.get(`/posts/${id}`);
		const { data } = res.data;
		return data;
	},
	async create(postData: TPostCreate): Promise<void> {
		await apiAuth().post("/posts", postData);
	},
	async update(id: number, postData: TPostCreate): Promise<void> {
		await apiAuth().put(`/posts/${id}`, postData);
	},
	async delete(id: number): Promise<void> {
		await apiAuth().delete(`/posts/${id}`);
	},
};

export default PostService;
