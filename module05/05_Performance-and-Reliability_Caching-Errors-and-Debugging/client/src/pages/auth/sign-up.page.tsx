import SEO from "@/components/seo/seo"
import { SignUpForm } from "@/pages/auth/forms/sign-up.form"

const SignUpPage = () => {
  return (
    <>
      <SEO title="Sign Up - Blog" description="Create a new account" />
      <section className="flex items-center justify-center">
        <SignUpForm />
      </section>
    </>
  )
}

export default SignUpPage
