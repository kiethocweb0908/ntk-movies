import { api } from "@/lib/api"
import { redirect } from "next/navigation"
import {
  AppResponse,
  FirstEpisodeResponse,
} from "@workspace/shared/schema/movie/movie.response"

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const { data } = await api<AppResponse<FirstEpisodeResponse>>(
    `/movies/first-episode/${slug}`
  )

  if (!data) return <div>Không tìm thấy tập phim</div>

  redirect(`/xem-phim/${slug}/${data.episodeSlug}?server=${data.serverId}`)
}

export default Page
