import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import React from "react"

const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 pt-28">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
