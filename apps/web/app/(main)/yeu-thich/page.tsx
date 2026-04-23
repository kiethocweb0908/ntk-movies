import FavoriteListClient from "@/components/profile/favorite-list"
import TitleSection from "@/components/ui/tittle-section"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const FavoritePage = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!accessToken && !refreshToken) redirect("/")
  return (
    <main className="px-5 pt-28 text-white">
      <TitleSection title="Danh sách phim yêu thích của bạn" className="mb-3" />
      <FavoriteListClient />
    </main>
  )
}

export default FavoritePage
