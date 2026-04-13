"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Logo } from "../layout/header/logo"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ResetPasswordFESchema,
  ResetPasswordFEType,
} from "@workspace/shared/schema/auth/auth.dto"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Checkbox } from "@workspace/ui/components/checkbox"

interface ResetPasswordFormProps {
  className?: string
  resetPasswordToken: string
  email: string
  props?: React.ComponentProps<"div">
}

const ResetPasswordForm = ({
  email,
  resetPasswordToken,
  className,
  ...props
}: ResetPasswordFormProps) => {
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<ResetPasswordFEType>({
    resolver: zodResolver(ResetPasswordFESchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
      resetToken: resetPasswordToken,
    },
    mode: "all",
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: ResetPasswordFEType) => {
    if (isRedirecting) return

    const resetPassword = async () => {
      const { confirmPassword, ...dataSubmit } = data
      const res = await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(dataSubmit),
      })
      return res
    }

    toast.promise(resetPassword(), {
      loading: "Đang xử lý...",
      success: (data) => {
        setIsRedirecting(true)
        router.push("/")
        router.refresh()
        return data.message || "Đổi mật khẩu thành công"
      },
      error: (err) => {
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
              <Field className="flex flex-col items-center gap-2 text-center">
                <div className="flex justify-center text-center">
                  <Logo />
                </div>
                <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
                <p className="text-sm text-balance">
                  Đặt lại mật khẩu mới cho tài khoản {email}.
                </p>
              </Field>

              {/* Mật khẩu */}
              <Field className="text-white">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Input
                  id="password"
                  type={!isChecked ? "password" : "text"}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              {/* Xác nhận mật khẩu */}
              <Field className="text-white">
                <FieldLabel htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type={!isChecked ? "password" : "text"}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Field>

              <Field className="flex-row items-center justify-between gap-2 text-white">
                <Checkbox
                  id="check"
                  checked={isChecked}
                  onCheckedChange={() => setIsChecked((prev) => !prev)}
                  className="h-5 w-5! border-primary/20 data-checked:border-primary/20 data-checked:bg-transparent data-checked:text-yellow-400"
                />
                <label
                  htmlFor="check"
                  className={`text-sm select-none ${isChecked ? "text-textHover" : "text-white"}`}
                >
                  Hiện mật khẩu
                </label>
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
                {isSubmitting || isRedirecting
                  ? "Đang xử lý..."
                  : "Tạo mật khẩu mới"}
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

export default ResetPasswordForm
