import z from "zod";

const chatSchema = z.object({
	sender: z.string().min(1, "Sender is required"),
	content: z
		.string()
		.min(1, "Content is required")
		.max(500, "Content must be less than 500 characters"),
	timestamp: z.date(),
});

type ChatMessage = z.infer<typeof chatSchema>;

export { chatSchema, type ChatMessage };
