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

  useEffect(() => {
    persistAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                <>
                  <NavMenuLink
                    label="Create Post"
                    path="/dashboard/posts/create"
                  />
                  <NavigationMenuItem>
                    <Button
                      onClick={async () => await signOut()}
                      variant={"destructive"}
                    >
                      Sign Out
                    </Button>
                  </NavigationMenuItem>
                </>
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
