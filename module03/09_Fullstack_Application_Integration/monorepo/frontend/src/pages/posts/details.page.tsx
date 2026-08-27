import useLoading from "@/hooks/use-loading";
import type { IPost } from "@/models/post.model";
import { useLoaderData } from "react-router";
import LoadingPage from "../loading";

const PostDetailsPage = () => {
	const post = useLoaderData<IPost>();
	const isLoading = useLoading();

	if (isLoading) {
		return <LoadingPage />;
	}
	return (
		<div className="flex flex-col gap-4 py-8">
			<h1 className="text-2xl font-bold">{post.title}</h1>
			<p className="text-gray-600">{post.content}</p>
			<p className="text-gray-500">Author: {post.author.email}</p>
			<p className="text-gray-500">
				Created At:{" "}
				{new Date(post.createdAt).toLocaleString("id-ID", {
					dateStyle: "medium",
					timeStyle: "short",
					timeZone: "Asia/Jakarta",
				})}
			</p>
		</div>
	);
};
export default PostDetailsPage;
