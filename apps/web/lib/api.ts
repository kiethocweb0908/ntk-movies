export const API_URL = process.env.BACKEND_API || "http://localhost:8000/api"

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    console.error(`Fetch error at ${endpoint}: ${res.statusText}`)
    const error: any = new Error(
      Array.isArray(data?.message)
        ? data.message[0]
        : data?.message || `API Error: ${res.status}`
    )
    error.status = res.status
    throw error
  }

  return data
}
