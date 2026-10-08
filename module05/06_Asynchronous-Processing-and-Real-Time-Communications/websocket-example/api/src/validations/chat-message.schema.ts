import z from "zod";

const chatMessageSchema = z.object({
	sender: z.string().min(1, "Sender is required"),
	content: z.string().min(1, "Content is required"),
	timestamp: z.coerce.date(),
});

export { chatMessageSchema };
