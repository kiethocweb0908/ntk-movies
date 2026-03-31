import { api } from "@/lib/api"
import {
  AppResponse,
  EpisodeVideoResponse,
} from "@workspace/shared/schema/movie/movie.response"
import { getYoutubeEmbedUrl } from "@workspace/ui/lib/utils"
import Link from "next/link"

// app/(main)/xem-phim/[slug]/[episode]/page.tsx
export default async function EpisodePage({
  params,
  searchParams,
}: {
  params: { slug: string; episode: string }
  searchParams: { server?: string }
}) {
  const [{ slug, episode }, sParams] = await Promise.all([params, searchParams])
  const serverId = sParams.server

  const { data } = await api<AppResponse<EpisodeVideoResponse>>(
    `/movies/episode?movieSlug=${slug}&episodeSlug=${episode}&serverId=${serverId}`
  )
  if (!data?.linkEmbed)
    return <div className="p-4 text-center">Không tìm thấy link phim</div>

  const embedUrl = getYoutubeEmbedUrl(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  )

  return (
    <div className="relative h-full w-full">
      <iframe
        src={process.env.PLAY_VIDEO ? data.linkEmbed : embedUrl}
        title="Movie Trailer"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-none"
      />

      {/* <div className="absolute bottom-4 left-4 flex gap-2">
        {["Server 1", "Server 2"].map((s, idx) => (
          <Link
            key={idx}
            href={`?server=${idx + 1}`}
            className={`rounded px-2 py-1 text-xs ${serverId === String(idx + 1) ? "bg-textHover" : "bg-black/60"}`}
          >
            {s}
          </Link>
        ))}
      </div> */}
    </div>
  )
}
