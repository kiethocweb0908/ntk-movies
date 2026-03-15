const API_URL = process.env.BACKEND_API || "http://localhost:8000"

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
  })

  if (!res.ok) {
    console.error(`Fetch error at ${endpoint}: ${res.statusText}`)
    throw new Error(`API Error: ${res.status}`)
  }

  return res.json()
}
