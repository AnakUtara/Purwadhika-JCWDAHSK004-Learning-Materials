import { SignInForm } from "@/pages/auth/forms/sign-in.form"
import SEO from "@/components/seo/seo"

const SignInPage = () => {
  return (
    <>
      <SEO title="Sign In - Blog" description="Login to your account" />
      <section className="flex items-center justify-center">
        <SignInForm />
      </section>
    </>
  )
}

export default SignInPage
