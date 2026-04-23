import OtpForm from "@/components/auth/otp-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const VerifyOtpPage = async () => {
  const cookieStore = await cookies()
  const otpEmail = cookieStore.get("otp_email")?.value
  const otpType = cookieStore.get("otp_type")?.value as
    | "REGISTER"
    | "FORGOT_PASSWORD"
    | undefined

  if (!otpEmail) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 pt-28">
      <div className="w-full max-w-sm md:max-w-4xl">
        <OtpForm email={otpEmail} type={otpType} />
      </div>
    </div>
  )
}

export default VerifyOtpPage
