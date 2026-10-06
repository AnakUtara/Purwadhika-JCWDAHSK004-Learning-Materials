import { authApi } from "./api.config"

export const getAllPosts = async () => {
  const res = await authApi.get("/posts")
  const { data } = res.data
  return data
}

export const getPostByID = async (id: string) => {
  const res = await authApi.get(`/posts/${id}`)
  const { data } = res.data
  return data
}

export const getPostsByAuthor = async () => {
  const res = await authApi.get("/posts/me")
  const { data } = res.data
  return data
}

export const createPost = async (data: Record<string, unknown>) => {
  await authApi.post("/posts", data)
}

export const updatePost = async (id: string, data: Record<string, unknown>) => {
  await authApi.put(`/posts/${id}`, data)
}

export const removePost = async (
  id: string,
  mode: "soft" | "hard" = "soft"
) => {
  await authApi.delete(`/posts/${id}`, { params: { mode } })
}
