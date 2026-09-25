import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn-ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/shadcn-ui/field"
import type { ComponentProps } from "react"
import TextField from "@/components/fields/text.field"
import { signUpSchema, type SignUpSchema } from "@/validators/auth.validation"
import { NavLink, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Spinner } from "@/components/shadcn-ui/spinner"
import { AxiosError } from "axios"
import { Card, CardContent } from "@/components/shadcn-ui/card"
import useAuthStore from "@/stores/auth.store"

export function SignUpForm({ className, ...props }: ComponentProps<"form">) {
  const { signUp } = useAuthStore()
  const navigator = useNavigate()

  const { control, handleSubmit, formState, reset } = useForm<SignUpSchema>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  })

  const { isSubmitting } = formState

  const submitHandler = async (data: SignUpSchema) => {
    const { email, password } = data

    try {
      await signUp(email, password)
      toast.success(
        "Account created successfully! Please login to your account."
      )
      navigator("/auth/sign-in")
    } catch (error) {
      toast.error(
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create account. Please try again."
      )
    } finally {
      reset()
    }
  }

  return (
    <Card className="max-w-sm flex-1">
      <CardContent>
        <form
          className={cn("flex flex-col gap-6", className)}
          onSubmit={handleSubmit(submitHandler)}
          {...props}
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-balance text-muted-foreground">
                Fill in the form below to create your account
              </p>
            </div>
            <TextField<SignUpSchema>
              name="email"
              label="Email"
              control={control}
              placeholder="m@example.com"
              description="We'll use this to contact you. We will not share your email with anyone else."
              disabled={isSubmitting}
            />
            <TextField<SignUpSchema>
              name="password"
              label="Password"
              control={control}
              placeholder="Enter your password"
              description="Make sure to choose a strong password to keep your account secure."
              type="password"
              disabled={isSubmitting}
            />
            <TextField<SignUpSchema>
              name="confirmPassword"
              label="Confirm Password"
              control={control}
              placeholder="Confirm your password"
              description="Please confirm your password."
              type="password"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <FieldSeparator>Or continue with</FieldSeparator>
            <Field>
              <FieldDescription className="px-6 text-center">
                Already have an account?{" "}
                <NavLink to="/auth/sign-in">Sign in</NavLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
