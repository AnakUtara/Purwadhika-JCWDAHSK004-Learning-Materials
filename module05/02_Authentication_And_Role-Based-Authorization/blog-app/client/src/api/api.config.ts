import axios, {
  AxiosError,
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios"
import { refreshToken } from "./auth/auth.api"

export let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
}

const staticApi: AxiosInstance = axios.create({ ...config })

const authApi: AxiosInstance = axios.create({
  ...config,
})

authApi.interceptors.request.use((req) => {
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`
  }

  return req
})

authApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      __retry: number
    }
    if (
      error.response?.status === 401 &&
      !originalRequest.__retry &&
      !originalRequest.url?.includes("refresh-token")
    ) {
      originalRequest.__retry = 1

      try {
        const tokens = await refreshToken()
        if (tokens && tokens.accessToken) {
          setAccessToken(tokens.accessToken)
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
          return authApi(originalRequest)
        }
      } catch (error) {
        setAccessToken(null)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// setup interceptors for authApi
// interceptors.[request/response].use parameter accepts 2 callbacks as arguments
// first is onFulfilled gives request object and second is onRejected gives error object
// request interceptor checks if accessToken is available.
// If available, add to request auth header
// response interceptor checks if response status is 401 with onRejected
// If 401, check if refresh token is available in cookie
// if available, make a post request to /refresh-token endpoint
// get the response, extract new access token and refresh token
// originalRequest is in response error.config

export { staticApi, authApi }
