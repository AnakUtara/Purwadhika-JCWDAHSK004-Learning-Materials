import { setAccessToken } from "@/api/api.config"
import {
  getAuthCredential,
  googleSignIn,
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "@/api/auth/auth.api"
import { toast } from "sonner"
import { create } from "zustand"

export type TUser = {
  id: number
  email: string
  role: "READER" | "EDITOR"
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type TUserCreate = {
  email: TUser["email"]
  password: string
  confirmPassword: string
}

export type TUserSignIn = {
  email: TUser["email"]
  password: string
}

type TAuthState = {
  user: TUser | null
  isInitialLoading: boolean
}

const authUserInitialState: TAuthState["user"] | null = null

type TAuthActions = {
  signIn: (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => Promise<void>
  googleSignIn: (idToken: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => Promise<void>
  signOut: (
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => Promise<void>
  persistAuth: () => Promise<void>
}

const useAuthStore = create<TAuthState & TAuthActions>((set) => ({
  user: authUserInitialState,
  isInitialLoading: true,
  signIn: async (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => {
    try {
      const data = await signIn(email, password)
      setAccessToken(data.accessToken)
      set({ user: data.user })
      onSuccess?.()
      toast.success("Sign in successful!")
    } catch (error) {
      onError?.(error)
      toast.error(
        "Sign in failed. Please check your credentials and try again."
      )
    }
  },
  googleSignIn: async (idToken: string) => {
    const data = await googleSignIn(idToken)
    setAccessToken(data.accessToken)
    set({ user: data.user })
  },
  signUp: async (
    email: string,
    password: string,
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => {
    try {
      await signUp(email, password)
      onSuccess?.()
      toast.success("Sign up successful! Please sign in.")
    } catch (error) {
      onError?.(error)
      toast.error(
        "Sign up failed. Please check your information and try again."
      )
    }
  },
  signOut: async (
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => {
    try {
      await signOut()
      set({ user: authUserInitialState })
      setAccessToken(null)
      onSuccess?.()
      toast.success("Sign out successful!")
    } catch (error) {
      onError?.(error)
      toast.error("Sign out failed. Please try again.")
    }
  },
  persistAuth: async () => {
    try {
      const token = await refreshToken()
      setAccessToken(token.accessToken)
      const data = await getAuthCredential()
      set({ user: data, isInitialLoading: false })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {
      setAccessToken(null)
      set({ user: authUserInitialState, isInitialLoading: false })
    }
  },
}))

export default useAuthStore
