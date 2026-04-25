// app/api/v1/movies/favorite/route.ts
import { fetchBackend } from "@/lib/server-fetch"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const res = await fetchBackend("/favorite", {
    method: "POST",
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  // Trả về cả data (chứa message, code từ NestJS) và status
  return NextResponse.json(data, { status: res.status })
}
