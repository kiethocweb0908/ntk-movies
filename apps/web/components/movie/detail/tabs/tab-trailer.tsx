import { getYoutubeEmbedUrl } from "@workspace/ui/lib/utils"

interface TabTrailerProps {
  trailerUrl: string
}

const TabTrailer = ({ trailerUrl }: TabTrailerProps) => {
  const embedUrl = getYoutubeEmbedUrl(trailerUrl)

  // Trường hợp không có dữ liệu URL
  if (!trailerUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/5 bg-slate-900/50 text-slate-500 italic">
        Phim hiện chưa có Trailer...
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title="Movie Trailer"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-none"
        />
      </div>
    </div>
  )
}

export default TabTrailer
