import { NavLink, useMatch, useResolvedPath } from "react-router"
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../shadcn-ui/navigation-menu"

type Props = {
  label: string
  path: string
}

const NavMenuLink = ({ label, path }: Props) => {
  const resolved = useResolvedPath(path)

  // Root route "/" must use strict end matching, parameterized/sub-routes should not
  const isRoot = path === "/"
  const match = useMatch({ path: resolved.pathname, end: isRoot })
  const isActive = Boolean(match)

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle()}
        render={(props) => (
          <NavLink
            {...props}
            className={`${props.className} ${
              isActive
                ? "!bg-primary !text-primary-foreground hover:!bg-primary/90 hover:!text-primary-foreground"
                : ""
            }`}
            to={path}
          >
            {label}
          </NavLink>
        )}
      />
    </NavigationMenuItem>
  )
}

export default NavMenuLink
