import useAuthStore from "@/stores/auth.store";
import { redirect, type MiddlewareFunction } from "react-router";

export const authMiddleware: MiddlewareFunction = async (_, next) => {
	const { user } = useAuthStore.getState();

	if (!user) {
		throw redirect("/login");
	}

	next();
};

export const guestMiddleware: MiddlewareFunction = async (_, next) => {
	const { user } = useAuthStore.getState();

	if (user) {
		throw redirect("/");
	}

	next();
};
