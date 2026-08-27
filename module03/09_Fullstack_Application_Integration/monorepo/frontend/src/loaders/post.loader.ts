import PostService from "@/api/posts.api";
import type { LoaderFunction, LoaderFunctionArgs } from "react-router";

const PostLoader: Record<string, LoaderFunction> = {
	async listLoader({ request }: LoaderFunctionArgs) {
		const url = new URL(request.url);

		// Extract from frontend URL: ?search=react&page=1&limit=10
		const search = url.searchParams.get("search") || undefined;

		const page = url.searchParams.get("page")
			? Number(url.searchParams.get("page"))
			: undefined;
		const limit = url.searchParams.get("limit")
			? Number(url.searchParams.get("limit"))
			: undefined;

		return PostService.getAll({ search, page, limit });
	},
	async detailsLoader({ params }: LoaderFunctionArgs) {
		const { id } = params;

		if (!id) {
			throw new Error("Post ID is required");
		}

		return PostService.getById(Number(id));
	},
};

export default PostLoader;
