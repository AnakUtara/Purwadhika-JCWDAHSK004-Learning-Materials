import App from "@/App"
import SignInPage from "@/pages/auth/sign-in.page"
import SignUpPage from "@/pages/auth/sign-up.page"
import GlobalErrorPage from "@/pages/errors/global-error.page"
import PostsCreatePage from "@/pages/posts/create.page"
import RootLayout from "@/layouts/root.layout"
import { createBrowserRouter } from "react-router"
import NotFoundErrorPage from "@/pages/errors/not-found-error.page"
import { ProtectedRoute } from "@/layouts/guards/protected-route.layout"
import { GuestRoute } from "@/layouts/guards/guest-route.layout"

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <GlobalErrorPage />,
    Component: RootLayout,
    children: [
      { index: true, element: <App /> },
      {
        path: "auth",
        element: <GuestRoute />,
        children: [
          {
            path: "sign-in",
            index: true,
            element: <SignInPage />,
          },
          {
            path: "sign-up",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <ProtectedRoute allowedRoles={["EDITOR"]} />,
        children: [
          {
            path: "posts",
            children: [
              {
                path: "create",
                element: <PostsCreatePage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundErrorPage />,
      },
    ],
  },
])

export default router
