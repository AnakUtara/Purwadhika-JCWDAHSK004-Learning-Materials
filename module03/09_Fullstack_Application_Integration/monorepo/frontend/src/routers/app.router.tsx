import { createBrowserRouter } from "react-router";
import NotFoundPage from "@/pages/errors/not-found.page";
import MainLayout from "@/layouts/main.layout";
import RegisterPage from "@/pages/auth/register.page";
import LoginPage from "@/pages/auth/login.page";
import { authMiddleware, guestMiddleware } from "./middlewares/auth.middleware";
import PostListPage from "@/pages/posts/list.page";
import PostDetailsPage from "@/pages/posts/details.page";
import CreatePostPage from "@/pages/posts/create.page";
import UpdatePostPage from "@/pages/posts/update.page";
import PostLoader from "@/loaders/post.loader";
import ErrorPage from "@/pages/errors/error.page";

const router = createBrowserRouter([
	{
		element: <MainLayout />,
		path: "/",
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				loader: PostLoader.listLoader,
				element: <PostListPage />,
			},
			{
				middleware: [guestMiddleware],
				children: [
					{ path: "login", element: <LoginPage /> },
					{ path: "register", element: <RegisterPage /> },
				],
			},
			{
				path: "posts",
				children: [
					{
						path: ":id",
						loader: PostLoader.detailsLoader,
						element: <PostDetailsPage />,
					},
					{
						middleware: [authMiddleware],
						children: [
							{ path: "create", element: <CreatePostPage /> },
							{ path: ":id/edit", element: <UpdatePostPage /> },
						],
					},
				],
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);

export default router;
