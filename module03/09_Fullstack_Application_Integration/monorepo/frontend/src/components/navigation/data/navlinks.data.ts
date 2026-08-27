type NavbarLink = {
	label: string;
	href: string;
};

const publicLinks: NavbarLink[] = [{ label: "Home", href: "/" }];

const guestLinks: NavbarLink[] = [
	{ label: "Sign In", href: "/login" },
	{ label: "Sign Up", href: "/register" },
];

const protectedLinks: NavbarLink[] = [
	{ label: "Create Post", href: "/posts/create" },
	{ label: "Sign Out", href: "/" },
];

export { publicLinks, guestLinks, protectedLinks, type NavbarLink };
