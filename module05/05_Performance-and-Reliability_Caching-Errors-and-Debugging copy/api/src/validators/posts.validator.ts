import z from "zod";

const sharedPostSchema = {
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be at most 100 characters"),
	content: z.string().min(10, "Content must be at least 10 characters"),
	coverUrl: z.url().optional(),
};

const createPostSchema = z.object(sharedPostSchema);

export { createPostSchema };
