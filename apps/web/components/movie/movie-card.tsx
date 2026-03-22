import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { formatStatus } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface MovieCardProps {
  movie: MovieResponse
  variant?: "horizontal" | "vertical"
  showTittle?: boolean
}

export const MovieCard = ({
  movie,
  variant = "vertical",
  showTittle = true,
}: MovieCardProps) => {
  const aspectClass = variant === "horizontal" ? "aspect-3/2" : "aspect-2/3"

  const src =
    variant === "horizontal"
      ? IMG_URL + movie.posterUrl
      : IMG_URL + movie.thumbUrl

  return (
    <div className="group flex flex-col items-center justify-between select-none">
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-lg`}
      >
        <Image
          src={src}
          alt={movie.name}
          fill
          className={`rounded-xl object-cover transition-transform duration-500 group-hover:scale-110`}
        />
        <div className="absolute right-0 bottom-0 left-0 flex text-xs text-primary">
          <span className="rounded-r-md bg-slate-600 p-2">
            {formatStatus(movie.status)}
          </span>
          {movie.status !== "trailer" && (
            <span className="rounded-md bg-slate-600 p-2 font-normal">
              {movie.lang}
            </span>
          )}
        </div>
      </div>
      {showTittle && (
        <Link
          href={`thong-tin-phim/${movie.slug}`}
          className="group relative block w-full cursor-pointer pt-4"
        >
          <h3 className="line-clamp-1 text-center text-sm font-semibold text-primary group-hover:text-textHover">
            {movie.name}
          </h3>

          <p className="line-clamp-1 text-center text-sm text-primary group-hover:text-textHover/60">
            {movie.originName}
          </p>
        </Link>
      )}
    </div>
  )
}
