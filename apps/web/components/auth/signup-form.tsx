"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/field"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  RegisterFESchema,
  RegisterFEType,
} from "@workspace/shared/schema/auth/auth.dto"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import ButtonLoginGoogle from "./button-login-google"
import { api } from "@/lib/api"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<RegisterFEType>({
    resolver: zodResolver(RegisterFESchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    mode: "all",
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: RegisterFEType) => {
    if (isRedirecting) return
    const { confirmPassword, ...dataToSubmit } = data
    const registerPromise = api<{ message: string }>("/auth/register", {
      body: JSON.stringify(dataToSubmit),
      method: "POST",
    })
    toast.promise(registerPromise, {
      loading: "Đang xử lý...",
      success: (data) => {
        router.push("/xac-thuc-otp")
        setIsRedirecting(true)
        return data.message || "Đăng ký thành công!"
      },
      error: (err: any) => {
        setIsRedirecting(false)
        return err.message
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-slate-900 p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-white">
                  Đăng ký tài khoản
                </h1>
                <p className="text-sm text-balance text-white">
                  Nhập thông tin của bạn bên dưới để đăng ký tài khoản.
                </p>
              </div>

              {/* Họ và Tên */}
              <Field className="grid grid-cols-2 gap-4 text-white">
                <Field>
                  <FieldLabel htmlFor="lastName">Họ</FieldLabel>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="firstName">Tên</FieldLabel>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </Field>
              </Field>

              {/* Email */}
              <Field className="text-white">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Username */}
              <Field className="text-white">
                <FieldLabel htmlFor="userName">Tên đăng nhập</FieldLabel>
                <Input id="userName" {...register("userName")} />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.userName.message}
                  </p>
                )}
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
              <Field className="flex-row items-center gap-2 text-white">
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

              {/* Nút đăng ký */}
              <Field>
                <Button
                  variant={"filter"}
                  className="py-2 text-lg"
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                >
                  {isSubmitting || isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-slate-900">
                hoặc tiếp tục với
              </FieldSeparator>
              <Field>
                {/* nút google */}
                <ButtonLoginGoogle />
              </Field>
              <FieldDescription className="text-center">
                Bạn đã có tài khoản? <Link href={"/dang-nhap"}>Đăng nhập</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/register.webp"
              alt="Image"
              fill
              sizes="350px"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.9]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
