import TitleSection from "@/components/ui/tittle-section"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { formatStatus } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface TopTistProps {
  movies: MovieResponse[]
}

const TopTist = ({ movies }: TopTistProps) => {
  return (
    <div className="text-white">
      {/* Tiêu đề phần */}
      <TitleSection tittle="Được xem nhiều nhất" />

      {/* Grid chứa danh sách phim */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-8">
        {movies.map((movie, index) => (
          <Link
            href={`thong-tin-phim/${movie.slug}`}
            key={movie.id}
            className="group relative perspective-[1000px]"
          >
            <div
              className={`relative aspect-2/3 w-full transition-all duration-500 ease-out ${index % 2 === 0 ? "rotate-y-[-15deg] -skew-y-5" : "rotate-y-[15deg] skew-y-5"} overflow-hidden rounded-2xl shadow-lg group-hover:translate-z-20 group-hover:scale-105 group-hover:rotate-y-0 group-hover:skew-y-0`}
            >
              <Image
                src={IMG_URL + movie.thumbUrl}
                alt={movie.name}
                fill
                sizes="(max-width: 768px) 50vw, 15vw"
                className="rounded-2xl object-cover"
                priority={index <= 3}
              />

              {/* Badges */}
              <div className="absolute bottom-3 left-3 z-10 flex gap-1.5 select-none">
                <span className="rounded border border-yellow-500/20 bg-black/40 px-2.5 py-1 text-xs font-semibold text-yellow-500 backdrop-blur-sm">
                  {movie.lang}
                </span>
              </div>
            </div>

            {/* Thông tin phim (Rank, Tên, Trạng thái) */}
            <div className="mt-6 flex items-start gap-2 select-none lg:gap-4">
              <span className="text-3xl leading-[0.7] font-black tracking-[-0.05em] text-yellow-500 drop-shadow-[0_2px_10px_rgba(255,223,0,0.3)] lg:text-6xl">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <h3 className="line-clamp-2 text-base font-bold tracking-tight text-white group-hover:text-textHover lg:line-clamp-1">
                  {movie.name}
                </h3>
                <p className="line-clamp-1 text-sm text-gray-400 group-hover:text-textHover/60">
                  {movie.originName}
                </p>
                <p className="text-xs font-bold text-gray-400 md:text-sm">
                  {formatStatus(movie.status)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopTist
