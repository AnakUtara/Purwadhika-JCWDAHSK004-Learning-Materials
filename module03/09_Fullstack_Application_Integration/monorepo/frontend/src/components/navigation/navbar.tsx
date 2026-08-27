import useAuthStore from "@/stores/auth.store";
import XAxisCenteredContainer from "../containers/x-axis-centered.container";
import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router";
import {
	guestLinks,
	protectedLinks,
	publicLinks,
	type NavbarLink,
} from "./data/navlinks.data";
import { Button } from "../shadcn-ui/button";

const NavigationBar = () => {
	const { user, signOut } = useAuthStore((state) => state);

	const navigate = useNavigate();

	const navbarLinks: NavbarLink[] = useMemo(() => {
		if (user) {
			return [...publicLinks, ...protectedLinks];
		} else {
			return [...publicLinks, ...guestLinks];
		}
	}, [user]);

	return (
		<div className="z-50 sticky top-0 py-4 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 shadow-md">
			<XAxisCenteredContainer className="flex items-center justify-evenly">
				{navbarLinks.map((link) =>
					link.label !== "Sign Out" ? (
						<NavLink
							key={link.href}
							to={link.href}
							className={({ isActive }) =>
								`mx-4 text-md font-semibold ${isActive ? "text-blue-500 underline" : "text-gray-700"}`
							}
						>
							{link.label}
						</NavLink>
					) : (
						<Button
							onClick={() => signOut(() => navigate("/"))}
							key={link.href}
							variant="destructive"
						>
							Sign Out
						</Button>
					),
				)}
			</XAxisCenteredContainer>
		</div>
	);
};
export default NavigationBar;
