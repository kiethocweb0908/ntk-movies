import HistoryListClient from "@/components/profile/history-list"
import TitleSection from "@/components/ui/tittle-section"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const HistoryPage = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!accessToken && !refreshToken) redirect("/")
  return (
    <main className="px-5 pt-28 text-white">
      <TitleSection title="Lịch sử phim đã xem của bạn" className="mb-3" />
      {/* component danh sách phim */}
      <HistoryListClient />
    </main>
  )
}

export default HistoryPage
