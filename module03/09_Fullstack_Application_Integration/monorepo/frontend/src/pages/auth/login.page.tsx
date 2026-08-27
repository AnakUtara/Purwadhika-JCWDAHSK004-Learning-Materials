import ViewportCenteredContainer from "@/components/containers/viewport-centered.container";
import { LoginForm } from "./components/forms/login.form";
import useLoading from "@/hooks/use-loading";
import LoadingPage from "../loading";

const LoginPage = () => {
	const isLoading = useLoading();

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<ViewportCenteredContainer>
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</ViewportCenteredContainer>
	);
};
export default LoginPage;
