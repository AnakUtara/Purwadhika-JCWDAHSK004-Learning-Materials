import Yup from "../libs/yup.js";

const createPostSchema = Yup.object().shape({
	title: Yup.string()
		.min(5, "Title must be at least 5 characters long")
		.max(100, "Title must be at most 100 characters long")
		.required("Title is required"),
	imageUrl: Yup.string().url("Invalid URL format").optional(),
	content: Yup.string()
		.min(20, "Content must be at least 20 characters long")
		.max(1000, "Content must be at most 1000 characters long")
		.required("Content is required"),
});

const updatePostSchema = Yup.object().shape({
	title: Yup.string()
		.min(5, "Title must be at least 5 characters long")
		.max(100, "Title must be at most 100 characters long")
		.optional(),
	imageUrl: Yup.string().url("Invalid URL format").optional(),
	content: Yup.string()
		.min(20, "Content must be at least 20 characters long")
		.max(1000, "Content must be at most 1000 characters long")
		.optional(),
});

export { createPostSchema, updatePostSchema };
