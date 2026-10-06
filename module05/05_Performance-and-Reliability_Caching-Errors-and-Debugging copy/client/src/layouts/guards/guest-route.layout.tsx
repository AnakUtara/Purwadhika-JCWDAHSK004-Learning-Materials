// src/components/guards/guest-route.tsx
import useAuthStore from "@/stores/auth.store"
import { Navigate, Outlet } from "react-router"

export const GuestRoute = () => {
  const { user } = useAuthStore()

  if (user) {
    const redirectPath =
      user.role === "EDITOR" ? "/dashboard/posts/create" : "/"
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
