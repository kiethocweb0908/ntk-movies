import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { LoginResponse } from "@workspace/shared/schema/auth/auth.response"
import { apiBackend } from "@/lib/backend-client"
import { setAuthCookies } from "@/lib/auth-cookies"

export async function POST(request: Request) {
  const body = await request.json()
  const headerStore = await headers()

  const userAgent = headerStore.get("user-agent") || ""
  const forwardedFor =
    headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip") || ""

  const { data, status, code, message } = await apiBackend<LoginResponse>(
    `/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": userAgent,
        "x-forwarded-for": forwardedFor,
      },
      body: JSON.stringify(body),
    }
  )

  if (status === 200 && data) {
    const { accessToken, favIds, refreshToken, user } = data
    await setAuthCookies({ accessToken, refreshToken })
    return NextResponse.json({ message, data: { user, favIds } }, { status })
  }

  return NextResponse.json({ message }, { status })
}
