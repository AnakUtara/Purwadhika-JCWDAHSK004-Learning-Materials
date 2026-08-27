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
import { Link, useNavigate } from "react-router";
import { Form, Formik, type FormikHelpers } from "formik";
import PasswordField from "../fields/password.field";
import { signUpSchema } from "@/validations/auth.validation";
import EmailField from "../fields/email.field";
import FormSubmitButton from "@/components/buttons/form-submit.button";
import useAuthStore, { type TUserCreate } from "@/stores/auth.store";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const { signUp } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = (
		values: TUserCreate,
		helpers: FormikHelpers<TUserCreate>,
	) => {
		signUp(
			values.email,
			values?.password ?? "",
			() => {
				helpers.resetForm();
				navigate("/login");
			},
			() => {
				helpers.setSubmitting(false);
				helpers.resetForm();
			},
		);
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Formik
					initialValues={{
						email: "",
						password: "",
						confirmPassword: "",
					}}
					validationSchema={signUpSchema}
					onSubmit={handleSubmit}
				>
					{({ isSubmitting }) => (
						<Form>
							<FieldGroup>
								<EmailField disabled={isSubmitting} />
								<PasswordField disabled={isSubmitting} />
								<PasswordField
									id="confirmPassword"
									label="Confirm Password"
									disabled={isSubmitting}
								/>
								<FieldGroup>
									<Field>
										<FormSubmitButton
											isSubmitting={isSubmitting}
											label="Create Account"
											submitLabel="Creating..."
										/>
										<FieldDescription className="px-6 text-center">
											Already have an account?{" "}
											<Link to="/sign-in">Sign in</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</FieldGroup>
						</Form>
					)}
				</Formik>
			</CardContent>
		</Card>
	);
}
