"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { Logo } from "../layout/header/logo"
import { Field, FieldGroup } from "@workspace/ui/components/field"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ForgotSchema,
  ForgotType,
} from "@workspace/shared/schema/auth/auth.dto"
import { toast } from "sonner"
import { api } from "@/lib/api"

const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<ForgotType>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: {
      identifier: "",
    },
    mode: "all",
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: ForgotType) => {
    if (isRedirecting) return

    const forgotPromise = api<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    })

    toast.promise(forgotPromise, {
      loading: "Đang xử lý...",
      success: (data) => {
        setIsRedirecting(true)
        router.push("/xac-thuc-otp")
        return data?.message || "Mã OTP đã được gửi vào email của bạn"
      },
      error: (err) => {
        setIsRedirecting(false)
        return err?.message || "Hành động thất bạii"
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-border bg-slate-900 p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-6 text-white">
              {/* header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <Logo />
                <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
                <p className="text-sm text-balance">
                  Nhập email hoặc tài khoản đăng ký để khôi phục mật khẩu.
                </p>
              </div>

              {/* identifier */}
              <Field className="flex flex-col gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    id="identifier"
                    {...register("identifier")}
                    className="pl-9"
                    autoComplete="identifier"
                    placeholder="Nhập email hoặc tên đăng nhập của bạn"
                  />
                  <Mail className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {/* error message */}
                {errors.identifier && (
                  <p className="text-red-400">{errors.identifier.message}</p>
                )}
              </Field>

              {/* button submit */}
              <Button
                variant="filter"
                type="submit"
                className="py-3 text-lg"
                disabled={isSubmitting || isRedirecting}
              >
                {(isSubmitting || isRedirecting) && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                {isSubmitting || isRedirecting ? "Đang xử lý..." : "Xác nhận"}
              </Button>

              <div className="text-center text-sm text-white *:[a]:hover:text-textHover">
                <Link
                  href="/dang-nhap"
                  className="underline underline-offset-4"
                >
                  Đăng nhập
                </Link>
                {" / "}
                <Link href="/dang-ky" className="underline underline-offset-4">
                  Đăng ký
                </Link>
              </div>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/register.webp"
              alt="Image"
              fill
              sizes="300px"
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%] dark:brightness-[0.75]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordForm
