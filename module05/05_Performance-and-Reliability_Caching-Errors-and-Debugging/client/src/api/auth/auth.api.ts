import { authApi, staticApi } from "../api.config"

export const signIn = async (email: string, password: string) => {
  const res = await staticApi.post("/auth/sign-in", { email, password })
  const { data } = res.data
  return data
}

export const signUp = async (
  email: string,
  password: string,
  role: "READER" | "EDITOR" = "READER"
) => {
  await staticApi.post("/auth/sign-up", { email, password, role })
}

export const signOut = async () => {
  await authApi.post("/auth/sign-out")
}

export const refreshToken = async () => {
  const res = await staticApi.post("/auth/refresh-token")
  const { data } = res.data
  return data
}

export const getAuthCredential = async () => {
  const res = await authApi.get("/auth/credential")
  const { data } = res.data
  return data
}

export const googleSignIn = async (idToken: string) => {
  const res = await staticApi.post("/auth/google/callback", { idToken })
  const { data } = res.data
  return data
}
