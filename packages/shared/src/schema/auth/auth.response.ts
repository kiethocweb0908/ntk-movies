export interface RegisterResponse {
  message: string
  email?: string
}

export interface Verify_REGISTER {
  accessToken: string
  refreshToken: string
  user?: {
    lastName: string | null
    firstName: string | null
    email: string | null
    userName: string | null
  }
}

export interface Verify_FORGOT_PASSWORD {
  message: string
  resetPasswordToken: string
}
