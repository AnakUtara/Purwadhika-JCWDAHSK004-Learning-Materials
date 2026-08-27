import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn-ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
} from "@/components/shadcn-ui/field";
import { Form, Formik, type FormikHelpers } from "formik";
import { signInSchema } from "@/validations/auth.validation";
import EmailField from "../fields/email.field";
import PasswordField from "../fields/password.field";
import { Link, useNavigate } from "react-router";
import FormSubmitButton from "@/components/buttons/form-submit.button";
import useAuthStore, { type TUserSignIn } from "@/stores/auth.store";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { signIn } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = (
		values: TUserSignIn,
		helpers: FormikHelpers<TUserSignIn>,
	) => {
		signIn(
			values.email,
			values.password,
			() => {
				helpers.resetForm();
				navigate("/");
			},
			() => {
				helpers.setSubmitting(false);
				helpers.resetForm();
			},
		);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Formik
						initialValues={{
							email: "",
							password: "",
						}}
						validationSchema={signInSchema}
						onSubmit={handleSubmit}
					>
						{({ isSubmitting }) => (
							<Form>
								<FieldGroup>
									<EmailField disabled={isSubmitting} />
									<PasswordField disabled={isSubmitting} />
									<Field>
										<FormSubmitButton
											isSubmitting={isSubmitting}
											label="Login"
											submitLabel="Logging in..."
										/>
										<FieldDescription className="text-center">
											Don&apos;t have an account?{" "}
											<Link to="/sign-up">Sign up</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</Form>
						)}
					</Formik>
				</CardContent>
			</Card>
		</div>
	);
}
