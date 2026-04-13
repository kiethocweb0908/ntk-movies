import ResetPasswordForm from "@/components/auth/reset-password-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ResetPasswordPage = async () => {
  const cookieStore = await cookies()
  const resetToken = cookieStore.get("reset_token")?.value
  const email = cookieStore.get("otp_email")?.value

  if (!resetToken || !email) {
    redirect("/quen-mat-khau")
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 pt-28">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm email={email} resetPasswordToken={resetToken} />
      </div>
    </div>
  )
}

export default ResetPasswordPage
