export interface RegisterResponse {
  email: string
  type: string
}

export interface ResendOTPResponse {
  message: string
}

export interface Verify_REGISTER {
  accessToken: string
  refreshToken: string
  user: UserResponse
}

export interface Verify_FORGOT_PASSWORD {
  message: string
  resetPasswordToken: string
}

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
