import { api } from "@/lib/api"
import { redirect } from "next/navigation"
import {
  AppResponse,
  FirstEpisodeResponse,
} from "@workspace/shared/schema/movie/movie.response"
import { isObject } from "framer-motion"

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const { data } = await api<AppResponse<FirstEpisodeResponse>>(
    `/movies/first-episode/${slug}`
  )

  if (!data?.episodeSlug || !data.serverId)
    return <div>Không tìm thấy tập phim</div>

  return redirect(
    `/xem-phim/${slug}/${data.episodeSlug}?server=${data.serverId}`
  )
}

export default Page
