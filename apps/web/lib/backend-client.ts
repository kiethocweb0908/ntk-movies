// lib/backend-client.ts

import { fetchBackend } from "./server-fetch"

export async function apiBackend<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{
  data: T | undefined
  status: number
  message?: string
  code?: string
}> {
  const res = await fetchBackend(endpoint, options)
  const data = await res.json().catch(() => null)

  return {
    data: data?.data ?? null,
    status: res.status,
    message: data?.message,
    code: data?.code,
  }
}
