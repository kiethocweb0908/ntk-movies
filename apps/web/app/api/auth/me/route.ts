import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { GetMeResponse } from "@workspace/shared/schema/auth/auth.response"
import { apiBackend } from "@/lib/backend-client"

const BE = process.env.NEXT_PUBLIC_BACKEND_API!

export async function GET() {
  const { data, status, message, code } =
    await apiBackend<GetMeResponse>("/auth/me")

  return NextResponse.json({ data, message, code }, { status })
}
