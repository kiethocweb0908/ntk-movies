"use client"

import { useState } from "react"
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
import { Input } from "@workspace/ui/components/input"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, LoginType } from "@workspace/shared/schema/auth/auth.dto"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { api } from "@/lib/api"
import ButtonLoginGoogle from "./button-login-google"

const SigninForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "all",
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: LoginType) => {
    if (isRedirecting) return
    const SignInPromise = api<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })

    toast.promise(SignInPromise, {
      loading: "Đang xử lý...",
      success: (data) => {
        setIsRedirecting(true)
        router.push("/")
        router.refresh()
        return data.message || "Đăng nhập thành công!"
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
                <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
                <p className="text-sm text-balance text-white">
                  Nhập thông tin của bạn để tiến hành đăng nhập.
                </p>
              </div>

              {/* Email */}
              <Field className="text-white">
                <FieldLabel htmlFor="identifier">Tài khoản/Email</FieldLabel>
                <Input
                  autoComplete="identifier"
                  id="text"
                  placeholder="Tài khoản hoặc email"
                  {...register("identifier")}
                />
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.identifier.message}
                  </p>
                )}
              </Field>

              {/* Mật khẩu */}
              <Field className="text-white">
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Input
                  autoComplete="current-password"
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

              <Field className="flex-row items-center justify-between gap-2 text-white">
                <div className="flex items-center gap-2">
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
                </div>
                <Link
                  href={"/quen-mat-khau"}
                  className="text-right hover:text-textHover"
                >
                  Quên mật khẩu?
                </Link>
              </Field>

              {/* Nút đăng ký */}
              <Field>
                <Button
                  variant={"filter"}
                  className="py-2! text-lg"
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                >
                  {isSubmitting || isRedirecting
                    ? "Đang xử lý..."
                    : "Đăng nhập"}
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
                Bạn chưa có tài khoản? <Link href={"/dang-ky"}>Đăng ký</Link>
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

export default SigninForm
