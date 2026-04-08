import z from "zod"

export const RegisterSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  userName: z
    .string()
    .min(6, "Tên tài khoản phải ít nhất 6 ký tự")
    .max(50, "Tên tài khoản không được vượt quá 50 ký tự"),
  password: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  firstName: z.string(),
  lastName: z.string(),
})

export const ResendOTPSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  type: z.enum(["REGISTER", "FORGOT_PASSWORD"], {
    errorMap: () => ({ message: "Loại xác thực không hợp lệ" }),
  }),
})

export const VerifyOTPSchema = ResendOTPSchema.extend({
  otp: z.string().length(6, "Mã OTP phải có đúng 6 chữ số"),
})

export interface DeviceInfoType {
  device?: string
  browser?: string
  os?: string
  ipAddress?: string
}

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(6, "Tên tài khoản phải ít nhất 6 ký tự")
    .max(50, "Tên tài khoản không được vượt quá 50 ký tự"),
  password: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
})

export const ResetPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  resetToken: z.string().min(1, "Thấy resetToken"),
})

export type RegisterType = z.infer<typeof RegisterSchema>
export type VerifyOtpType = z.infer<typeof VerifyOTPSchema>
export type ResendOtpType = z.infer<typeof ResendOTPSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
