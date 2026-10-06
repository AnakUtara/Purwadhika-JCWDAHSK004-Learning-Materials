import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { RouterProvider } from "react-router"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import router from "./routers/app.router"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "./components/shadcn-ui/sonner"
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 
     Dapatkan Google Auth Client ID dari console.cloud.google.com di Google Auth Platform.
     Saat buat project baru nanti bisa pilih untuk setup OAuth 2.0.
     Setelah itu baru akan diarahkan untuk membuat OAuth 2.0 client & setelah itu akan ada Client ID.
     Pastikan Client ID disimpan di .env dengan nama VITE_GOOGLE_AUTH_CLIENT_ID
     masukkan juga frontend URL-nya di field Javascript origin field & API URL di redirect URLs.
     Untuk development pakai localhost dulu tidak apa2.
    */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <HelmetProvider>
        <ThemeProvider>
          <Toaster />
          <RouterProvider {...{ router }} />
        </ThemeProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
