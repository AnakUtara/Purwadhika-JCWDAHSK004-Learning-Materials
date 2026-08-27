import useLoading from "@/hooks/use-loading";
import LoadingPage from "../loading";
import { Form, Formik, type FormikHelpers } from "formik";
import PostForm from "./components/post.form";
import { createPostSchema } from "@/validations/post.validation";
import type { TPostCreate } from "@/validations/post.validation";
import PostService from "@/api/posts.api";
import { useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";

const CreatePostPage = () => {
	const isLoading = useLoading();
	const navigate = useNavigate();
	const revalidator = useRevalidator();

	if (isLoading) {
		return <LoadingPage />;
	}

	const handleSubmit = async (
		values: TPostCreate,
		{ resetForm }: FormikHelpers<TPostCreate>,
	) => {
		try {
			await PostService.create(values);
			resetForm();
			revalidator.revalidate();
			navigate("/");
			toast.success("New Post added successfully!");
		} catch (error: unknown) {
			resetForm();
			toast.error(
				`Something went wrong: ${error instanceof AxiosError ? error.response?.data.message : (error as Error).message}`,
			);
		}
	};

	return (
		<div className="p-8">
			<Formik
				initialValues={{
					title: "",
					content: "",
				}}
				validationSchema={createPostSchema}
				onSubmit={handleSubmit}
			>
				{() => (
					<Form className="flex flex-col gap-4">
						<PostForm />
					</Form>
				)}
			</Formik>
		</div>
	);
};
export default CreatePostPage;
