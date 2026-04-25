import { FavoritesResponse } from "../favorite/favorite.response.js"

export interface OTPResponse {
  otpEmail: string
  otpType: "REGISTER" | "FORGOT_PASSWORD"
}

export interface ResendOTPResponse {
  message: string
}

export interface Verify_REGISTER {
  accessToken: string
  refreshToken: string
  user: UserResponse
  favIds: string[]
}

export interface Verify_FORGOT_PASSWORD {
  resetPasswordToken: string
}

export interface ResetPasswordResponse {}

export interface UserResponse {
  id: string
  role: string
  email: string
  userName?: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl?: string | null
  avatarId?: string | null
}

export interface GetMeResponse {
  user: UserResponse
  favIds: string[]
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}
export interface LoginResponse extends GetMeResponse, TokenResponse {}
export interface LoginResponseClient extends GetMeResponse {}
