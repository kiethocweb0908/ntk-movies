"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { InputOTP, InputOTPSlot } from "@workspace/ui/components/input-otp"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@workspace/ui/components/field"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "../layout/header/logo"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { ResendOTPResponse } from "@workspace/shared/schema/auth/auth.response"
import { useApi } from "@/hooks/use-api"

interface OtpFormProps {
  className?: string
  type?: "REGISTER" | "FORGOT_PASSWORD"
  email: string
  props?: React.ComponentProps<"div">
}

const OtpForm = ({
  email,
  type = "REGISTER",
  className,
  ...props
}: OtpFormProps) => {
  const { callApi } = useApi()
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Xác nhận
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return toast.error("Vui lòng nhập đủ 6 số")

    setLoading(true)
    const verifyPromise = callApi<{ message: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, type, otp }),
    })

    toast.promise(verifyPromise, {
      loading: "Đang xác minh...",
      success: (data) => {
        setTimeout(() => {
          setLoading(false)
        }, 300)
        if (type === "FORGOT_PASSWORD") {
          router.push("/khoi-phuc-mat-khau")
        } else {
          router.push("/")
          router.refresh()
        }
        return data.message || "Xác thực thành công!"
      },
      error: (err) => {
        setTimeout(() => {
          setLoading(false)
        }, 300)
        return err.message || "Mã OTP không đúng hoặc đã hết hạn"
      },
    })
  }

  // Gửi lại OTP
  const handleResend = async () => {
    const data = { email, type }
    const resendReq = async () => {
      const res = await api<ResendOTPResponse>("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return res
    }

    setCountdown(30) // Reset đồng hồ
    toast.promise(resendReq(), {
      loading: "Đang gửi lại mã...",
      success: (data) => data.message || "Đăng ký thành công!",

      error: (err) => err.message || "Gửi lại mã thất bại",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex-1 overflow-hidden bg-slate-950 p-0">
        <CardContent className="grid flex-1 p-0 md:grid-cols-2">
          <form
            onSubmit={handleVerify}
            className="flex flex-col items-center justify-center p-6 md:p-8"
          >
            <FieldGroup className="text-white">
              <Field className="items-center text-center">
                <div className="flex justify-center text-center">
                  <Logo />
                </div>
                <h1 className="text-2xl font-bold">Nhập mã xác minh</h1>
                <p className="text-sm text-balance text-white">
                  Chúng tôi đã gửi mã OTP đến{" "}
                  <span className="text-textHover">{email}</span>
                </p>
              </Field>
              <Field>
                <div className="flex w-full justify-center py-4">
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    containerClassName="gap-2 md:gap-3 text-white"
                  >
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-10 rounded-md border-muted-foreground/40 md:h-14 md:w-12"
                    />
                  </InputOTP>
                </div>
                <FieldDescription className="text-center">
                  Nhập mã 6 chữ số được gửi đến email của bạn
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  variant="filter"
                  disabled={loading}
                  className="py-2 text-xl font-semibold"
                >
                  {loading ? "Đang xác minh..." : "Xác minh"}
                </Button>
              </Field>

              {/* Gửi lại mã */}
              <Field>
                <FieldDescription className="text-center">
                  Không nhận được mã?{" "}
                  <Button
                    type="button"
                    variant={"link"}
                    className="cursor-pointer px-0 underline hover:text-textHover"
                    disabled={countdown > 0}
                    onClick={handleResend}
                  >
                    Gửi lại
                  </Button>
                </FieldDescription>
              </Field>

              {/* Có tài khoản */}
              <Field>
                <FieldDescription className="text-center">
                  <Link
                    href="/dang-nhap"
                    className="mx-auto flex w-fit items-center gap-1 px-0 text-primary underline"
                  >
                    <ArrowLeft className="size-4" />
                    Quay lại đăng nhập
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/register.webp"
              alt="Image"
              fill
              sizes="350px"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.75]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OtpForm
