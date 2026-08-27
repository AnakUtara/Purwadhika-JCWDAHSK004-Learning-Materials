import Yup from "@/lib/yup";

const commonSchema = {
	title: Yup.string()
		.min(10, "Title must be at least 10 characters long")
		.max(100, "Title must be at most 100 characters long")
		.required("Title is required"),
	imageUrl: Yup.string().url("Invalid URL format").optional(),
	content: Yup.string()
		.min(20, "Content must be at least 20 characters long")
		.max(1000, "Content must be at most 1000 characters long")
		.required("Content is required"),
};

export const createPostSchema = Yup.object().shape(commonSchema);
export type TPostCreate = Yup.InferType<typeof createPostSchema>;

export const updatePostSchema = Yup.object().shape(commonSchema);
export type TPostUpdate = Yup.InferType<typeof updatePostSchema>;
