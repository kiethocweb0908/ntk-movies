import VideoPlayer from "@/components/video/video-player"
import { api } from "@/lib/api"
import {
  AppResponse,
  EpisodeVideoResponse,
} from "@workspace/shared/schema/movie/movie.response"
import { getYoutubeEmbedUrl } from "@workspace/ui/lib/utils"

export default async function EpisodePage({
  params,
  searchParams,
}: {
  params: { slug: string; episode: string }
  searchParams: { server?: string }
}) {
  if (process.env.VIDEO) {
    const embedUrl = getYoutubeEmbedUrl(process.env.VIDEO.toString())
    return (
      <div className="relative aspect-video h-full">
        <iframe
          src={embedUrl}
          title="Movie Trailer"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-none"
        />
      </div>
    )
  }

  const [{ slug, episode }, sParams] = await Promise.all([params, searchParams])
  const serverId = sParams.server

  const { data } = await api<AppResponse<EpisodeVideoResponse>>(
    `/movies/episode?movieSlug=${slug}&episodeSlug=${episode}&serverId=${serverId}`
  )
  if (!data.linkM3u8 && !data.linkM3u8)
    return <div className="p-4 text-center">Không tìm thấy link phim</div>
  console.log(data)

  return (
    <div className="relative aspect-video h-full">
      <VideoPlayer
        url={data.linkM3u8 || data.linkEmbed!}
        title={"Tập " + data.name || ""}
      />
    </div>
  )
}
