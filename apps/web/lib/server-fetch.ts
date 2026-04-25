import { cookies } from "next/headers"
import { clearAuthCookies, setAuthCookies } from "./auth-cookies"

const BE_URL = process.env.NEXT_PUBLIC_BACKEND_API!

export async function fetchBackend(
  endpoint: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  const url = `${BE_URL}${endpoint}`
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  // tránh loop refresh
  if (endpoint === "/auth/refresh") {
    return fetch(url, options)
  }

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)
  console.log(1)

  let res = await fetch(url, { ...options, headers })

  // ===== refresh =====
  if (res.status === 401 && refreshToken) {
    console.log(2)
    const refreshRes = await fetch(`${BE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!refreshRes.ok) {
      console.log(3)
      await clearAuthCookies()
      return new Response(
        JSON.stringify({ message: "SESSION_EXPIRED", code: "SESSION_EXPIRED" }),
        { status: 401 }
      )
    } else {
      console.log(4)
      const { data } = await refreshRes.json()
      const newAt = data.accessToken
      await setAuthCookies({ accessToken: newAt })
      headers.set("Authorization", `Bearer ${newAt}`)
      res = await fetch(url, { ...options, headers })
    }
  }

  return res
}
