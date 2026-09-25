import HCenteredContainer from "@/components/containers/h-centered.container"
import NavMenuLink from "@/components/navigations/link.nav"
import { Button } from "@/components/shadcn-ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/shadcn-ui/navigation-menu"
import LoadingPage from "@/pages/loading.page"
import useAuthStore from "@/stores/auth.store"
import { useEffect } from "react"
import { Outlet } from "react-router"

const RootLayout = () => {
  const { user, signOut, persistAuth, isInitialLoading } = useAuthStore()

  // Setiap refresh root layout pasti akan trigger persist auth setelah component di-render
  useEffect(() => {
    persistAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Supaya setiap berganti page bahkan dari browser url input
  // selalu ada loading screen fullscreen
  // Jadi cukup sekali memanggil loading page di root layout
  // Ini tetap tergantung kebutuhan aplikasi
  // Karena tujuan demo ini lebih ke efisiensi bukan estetika
  if (isInitialLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <nav className={"text-primary-accent sticky top-0 z-50 w-full bg-accent"}>
        <div className="container mx-auto flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavMenuLink label="Home" path="/" />
              {!user ? (
                <>
                  <NavMenuLink label="Sign In" path="/auth/sign-in" />
                  <NavMenuLink label="Sign Up" path="/auth/sign-up" />
                </>
              ) : (
                <NavigationMenuItem>
                  <Button
                    onClick={async () => await signOut()}
                    variant={"destructive"}
                  >
                    Sign Out
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
      <HCenteredContainer>
        <Outlet />
      </HCenteredContainer>
    </>
  )
}
export default RootLayout
