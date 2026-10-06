import z from "zod"

const sharedPostSchema = {
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  cover: z
    .file()
    .refine((file) => file && file.size <= 1.5 * 1024 ** 2, {
      message: "Cover file size must be less than 1.5MB",
    })
    .refine((file) => file?.type.startsWith("image/"), {
      message: "Cover file must be an image",
    }),
}

export const createPostSchema = z.object(sharedPostSchema)

export type PostCreate = z.infer<typeof createPostSchema>
