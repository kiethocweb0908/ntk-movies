import { useAuthStore } from "@/store/use-auth-store"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"

export const useFavorite = (movieId?: string) => {
  const toggleFav = useAuthStore((s) => s.toggleFav)
  const favIdsSet = useAuthStore((s) => s.favIdsSet)
  const { callApi } = useApi()

  const isFavourited = movieId ? favIdsSet.has(movieId) : false

  const handleToggleFavorite = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!movieId) return

    toggleFav(movieId)

    try {
      const res = await callApi<{ message: string }>(`/favorite/${movieId}`, {
        method: "POST",
      })

      toast.success(res.message)
    } catch (error: any) {
      toggleFav(movieId)
      toast.error(error.message || "Không thể cập nhật trạng thái yêu thích")
    }
  }

  return { isFavourited, handleToggleFavorite }
}
