import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {}),
      },
    }
  )

  const data: AppResponse<null> = await res.json().catch(() => null)

  // 2. Xóa sạch Cookie ở trình duyệt
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  return NextResponse.json(data || { message: "Đăng xuất thành công!" })
}
