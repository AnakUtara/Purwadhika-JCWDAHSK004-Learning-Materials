import useAuthStore from "@/stores/auth.store"
import { Navigate, Outlet } from "react-router"

type Props = {
  allowedRoles: Array<"READER" | "EDITOR">
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // 4. Authorized -> Render nested routes
  return <Outlet />
}
