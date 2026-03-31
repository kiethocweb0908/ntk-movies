import RatingBadge from "@/components/ui/rating-badge"
import { MovieResponseFull } from "@workspace/shared/schema/movie/movie.response"
import { Badge } from "@workspace/ui/components/badge"
import { IMG_URL } from "@workspace/ui/lib/config"
import { formatContent } from "@workspace/ui/lib/utils"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MovieWatchInfoProps {
  movie: MovieResponseFull
}

const MovieWatchInfo = ({ movie }: MovieWatchInfoProps) => {
  return (
    <div className="flex w-full flex-col justify-between gap-5 lg:h-45 lg:flex-row">
      {/* ảnh tên, đánh giá */}
      <div className="flex w-full gap-5 lg:h-full">
        <div className="relative aspect-2/3 min-w-30 lg:h-full lg:w-auto">
          <Image
            src={IMG_URL + movie.thumbUrl}
            alt={movie.name}
            fill
            sizes="100px"
            className="rounded object-cover"
          />
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="line-clamp-2 text-lg font-semibold text-balance text-textHover">
              {movie.name}
            </h2>
            <span className="line-clamp-2 text-base text-balance text-textHover/60 italic">
              {movie.originName}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RatingBadge
              variant="imdb"
              vote={movie.imdb_vote_average?.toString() || "0"}
            />
            <RatingBadge
              variant="tmdb"
              vote={movie.tmdb_vote_average?.toString() || "0"}
            />
            <Badge variant={"category"}>{movie.year?.toString()}</Badge>
            <Badge variant={"category"}>{movie.episodeTotal?.toString()}</Badge>
            <Badge variant={"category"}>{movie.time}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {movie.categories.map((cat) => (
              <Badge variant={"category"} key={cat.slug}>
                {cat.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {movie.countries.map((cat) => (
              <Badge variant={"category"} key={cat.slug}>
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      {/* mô tả */}
      <div className="flex h-full w-full flex-col justify-between lg:max-w-sm">
        <p className="line-clamp-3 text-justify lg:line-clamp-6">
          {formatContent(movie.content || "")}
        </p>
        <Link
          href={`/phim/${movie.slug}`}
          className="flex w-fit items-center gap-1 text-textHover hover:text-yellow-400"
        >
          Xem thông tin phim <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  )
}

export default MovieWatchInfo
