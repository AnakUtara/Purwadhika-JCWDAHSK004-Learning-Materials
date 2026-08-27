import { Button } from "@/components/shadcn-ui/button";
import { Spinner } from "@/components/shadcn-ui/spinner";

type Props = {
	label?: string;
	submitLabel?: string;
	isSubmitting?: boolean;
};
const FormSubmitButton = ({
	label = "Submit",
	submitLabel = "Submitting...",
	isSubmitting = false,
}: Props) => {
	return (
		<Button type="submit" disabled={isSubmitting}>
			{isSubmitting ? <Spinner /> : null}
			{!isSubmitting ? label : submitLabel}
		</Button>
	);
};
export default FormSubmitButton;
