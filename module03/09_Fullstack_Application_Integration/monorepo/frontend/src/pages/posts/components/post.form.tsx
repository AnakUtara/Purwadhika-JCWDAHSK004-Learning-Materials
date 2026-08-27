import { Button } from "@/components/shadcn-ui/button";
import { Field, FieldLabel } from "@/components/shadcn-ui/field";
import { Input } from "@/components/shadcn-ui/input";
import { Spinner } from "@/components/shadcn-ui/spinner";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { cn } from "@/lib/utils";
import type { TPostCreate } from "@/models/post.model";
import { ErrorMessage, useFormikContext } from "formik";

const PostForm = () => {
	const { values, handleChange, isSubmitting, errors, touched } =
		useFormikContext<TPostCreate>();
	return (
		<>
			<Field>
				<FieldLabel htmlFor="title">Title</FieldLabel>
				<Input
					id="title"
					name="title"
					placeholder="Title"
					value={values.title}
					onChange={handleChange}
					className={
						errors.title && touched
							? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
							: ""
					}
					disabled={isSubmitting}
				/>
				<ErrorMessage
					className="text-destructive"
					component="div"
					name="title"
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="content">Content</FieldLabel>
				<Textarea
					id="content"
					name="content"
					placeholder="Content"
					value={values.content}
					onChange={handleChange}
					className={cn(
						errors.content && touched
							? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
							: "",
						"h-32",
					)}
					disabled={isSubmitting}
				/>
				<ErrorMessage
					className="text-destructive"
					component="div"
					name="content"
				/>
			</Field>
			<Button size={"lg"} type="submit" disabled={isSubmitting}>
				{isSubmitting ? <Spinner /> : null} Submit
			</Button>
		</>
	);
};
export default PostForm;
