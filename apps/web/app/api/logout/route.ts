// app/api/register/route.ts
import { api } from "@/lib/api"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { RegisterResponse } from "@workspace/shared/schema/auth/auth.response"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.toString()
    console.log("allCookies trong route: ", allCookies)
    const res = await api<AppResponse<RegisterResponse>>("/auth/logout", {
      method: "POST",
      headers: {
        Cookie: allCookies,
      },
    })

    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")

    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status || 400 }
    )
  }
}
