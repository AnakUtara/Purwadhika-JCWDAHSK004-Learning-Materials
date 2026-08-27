import { apiStatic, setAccessToken } from "@/configs/api.config";
import { toast } from "sonner";
import { create } from "zustand";

export type TUser = {
	id: number;
	email: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};

export type TUserCreate = {
	email: TUser["email"];
	password: string;
	confirmPassword: string;
};

export type TUserSignIn = {
	email: TUser["email"];
	password: string;
};

type TAuthState = {
	user: TUser | null;
};

const authUserInitialState: TUser | null = null;

type TAuthActions = {
	signIn: (
		email: string,
		password: string,
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => Promise<void>;
	signUp: (
		email: string,
		password: string,
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => Promise<void>;
	signOut: (
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => Promise<void>;
};

const useAuthStore = create<TAuthState & TAuthActions>((set) => ({
	user: authUserInitialState,
	signIn: async (
		email: string,
		password: string,
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => {
		try {
			const res = await apiStatic.post("/auth/sign-in", { email, password });
			const { data } = res.data;
			set({ user: data.user });
			setAccessToken(data.accessToken);
			onSuccess?.();
			toast.success("Sign in successful!");
		} catch (error) {
			onError?.(error);
			toast.error(
				"Sign in failed. Please check your credentials and try again.",
			);
		}
	},
	signUp: async (
		email: string,
		password: string,
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => {
		try {
			await apiStatic.post("/auth/sign-up", { email, password });
			onSuccess?.();
			toast.success("Sign up successful! Please sign in.");
		} catch (error) {
			onError?.(error);
			toast.error(
				"Sign up failed. Please check your information and try again.",
			);
		}
	},
	signOut: async (
		onSuccess?: () => void,
		onError?: (error: unknown) => void,
	) => {
		try {
			set({ user: authUserInitialState });
			setAccessToken(null);
			onSuccess?.();
			toast.success("Sign out successful!");
		} catch (error) {
			onError?.(error);
			toast.error("Sign out failed. Please try again.");
		}
	},
}));

export default useAuthStore;
