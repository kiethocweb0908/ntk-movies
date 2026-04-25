"use server"
import { cookies } from "next/headers"

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
}

export async function setAuthCookies(tokens: {
  accessToken: string
  refreshToken?: string
}) {
  const cookieStore = await cookies()

  cookieStore.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  })

  if (tokens.refreshToken) {
    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
  }
}
