import { SignupForm } from "@/components/auth/signup-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const RegisterPage = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (accessToken || refreshToken) redirect("/")
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 pt-28">
      <div className="w-full sm:max-w-md md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}

export default RegisterPage
