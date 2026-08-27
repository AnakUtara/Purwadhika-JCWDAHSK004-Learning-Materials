import {
	Link,
	useLoaderData,
	useNavigate,
	useNavigation,
	useSearchParams,
} from "react-router";
import type { IPost } from "@/models/post.model";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import LoadingPage from "../loading";
import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/shadcn-ui/card";
import type { IResponse } from "@/models/response.model";
import useDebounce from "@/hooks/use-debounce";

const PostListPage = () => {
	const { data: posts, meta } = useLoaderData() as IResponse<IPost[]>;

	const [searchParams] = useSearchParams();

	const navigate = useNavigate();
	const navigation = useNavigation();

	const [inputValue, setInputValue] = useState(
		searchParams.get("search") || "",
	);

	const debouncedQuery = useDebounce(inputValue, 500);

	const currentPage = Number(searchParams.get("page")) || 1;

	useEffect(() => {
		navigate(`?page=1&search=${debouncedQuery}`);
	}, [debouncedQuery, navigate]);

	const handlePaginate = (page: number) => {
		navigate(`?page=${page}&search=${debouncedQuery}`);
	};

	return (
		<div className="py-8 flex flex-col gap-4">
			<Input
				value={inputValue}
				onChange={(e) => {
					setInputValue(e.target.value);
				}}
				placeholder="Search posts..."
			/>

			{navigation.state === "loading" ? (
				<LoadingPage />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{posts.map((post: IPost) => (
						<Card
							key={post.id}
							className="p-4 hover:shadow-lg transition-shadow duration-300"
						>
							<CardTitle>
								<Link to={`/posts/${post.id}`}>{post.title}</Link>
							</CardTitle>
						</Card>
					))}
				</div>
			)}
			<div className="flex items-center justify-center gap-4 mt-4">
				<Button
					onClick={() => handlePaginate(currentPage - 1)}
					disabled={currentPage === 1 || navigation.state === "loading"}
				>
					Previous
				</Button>
				<span>
					Page {meta.currentPage} / {meta.totalPages || 1}
				</span>
				<Button
					onClick={() => handlePaginate(currentPage + 1)}
					disabled={
						currentPage === (meta.totalPages || 1) ||
						navigation.state === "loading"
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
};
export default PostListPage;
