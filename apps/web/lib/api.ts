export const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000/api"

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const customHeaders = options.headers || {}

    let serverCookies = ""

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers")
      const cookieStore = await cookies()
      serverCookies = cookieStore.toString()
    }

    const mergedHeaders = {
      "Content-Type": "application/json",
      ...customHeaders,
      ...(serverCookies ? { Cookie: serverCookies } : {}),
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: mergedHeaders,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const message = Array.isArray(data?.message)
        ? data.message[0]
        : data?.message
      const error: any = new Error(message || `API Error: ${res.status}`)
      error.status = res.status
      error.code = message
      console.error(`Fetch error at ${endpoint}: ${res.statusText}`)
      throw error
    }

    return data
  } catch (err) {
    console.error("🚨 NETWORK ERROR:", err)

    const error: any = new Error("BACKEND_UNAVAILABLE")
    error.code = "BACKEND_UNAVAILABLE"
    error.status = 503

    throw error
  }
}
