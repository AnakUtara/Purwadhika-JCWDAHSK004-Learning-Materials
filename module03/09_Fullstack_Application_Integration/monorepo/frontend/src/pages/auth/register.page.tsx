import ViewportCenteredContainer from "@/components/containers/viewport-centered.container";
import { SignupForm } from "./components/forms/register.form";

const RegisterPage = () => {
	return (
		<ViewportCenteredContainer>
			<div className="w-full max-w-sm">
				<SignupForm />
			</div>
		</ViewportCenteredContainer>
	);
};
export default RegisterPage;
