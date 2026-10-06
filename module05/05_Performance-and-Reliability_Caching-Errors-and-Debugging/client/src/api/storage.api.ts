import { authApi } from "./api.config"

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append("cover", file)

  const res = await authApi.post("/storage/images", formData)
  const { data } = res.data
  return data
}
