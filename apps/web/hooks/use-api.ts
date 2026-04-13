import { api } from "@/lib/api"
import { handleApiError } from "@/lib/api-handler"
import { useRouter } from "next/navigation"

export const useApi = () => {
  const router = useRouter()

  const callApi = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    try {
      return await api<T>(endpoint, options)
    } catch (error: any) {
      const errorInfo = handleApiError(error)
      if (errorInfo.shouldRedirect) {
        error.message = errorInfo.message
        router.push("/dang-nhap")
        router.refresh()
      } else {
        error.message = errorInfo.message
      }
      throw error
    }
  }

  return { callApi }
}
