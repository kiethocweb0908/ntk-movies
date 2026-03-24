import RatingBadge from "@/components/ui/rating-badge"
import { MovieResponseFull } from "@workspace/shared/schema/movie/movie.response"
import { Badge } from "@workspace/ui/components/badge"
import {
  formatContent,
  formatStatus,
  formatType,
  getBadgeColor,
} from "@workspace/ui/lib/utils"
import InfoRow from "./info-row"
import MovieThumbnail from "./movie-thumbnail"

interface MovieInfoSideProps {
  movie: MovieResponseFull
}

const MovieInfoSide = ({ movie }: MovieInfoSideProps) => {
  return (
    <div className="-translate-y-40">
      <div className="group flex w-full flex-col items-center">
        {/* Thumbnail */}
        <MovieThumbnail thumbUrl={movie.thumbUrl || ""} name={movie.name} />

        {/* Tiêu đề phim */}
        <div className="mb-6 w-full text-center">
          <h1 className="mb-2 line-clamp-3 text-3xl font-bold text-balance transition-colors group-hover:text-textHover">
            {movie.name}
          </h1>
          <h2 className="text-base text-primary italic group-hover:text-textHover/60">
            {movie.originName}
          </h2>
        </div>
      </div>

      {/* Rating & Badges nhanh */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <RatingBadge
          variant="imdb"
          vote={movie.imdb_vote_average?.toString() || "0"}
        />
        <RatingBadge
          variant="tmdb"
          vote={movie.tmdb_vote_average?.toString() || "0"}
        />
        <Badge variant={"category"}>{formatType(movie.type)}</Badge>
        <Badge variant={"category"}>{movie.time}</Badge>
        <Badge variant={"category"}>{movie.year?.toString()}</Badge>
        <Badge variant={"category"} className={getBadgeColor("status")}>
          {formatStatus(movie.status)}
        </Badge>
      </div>

      {/* Thông tin chi tiết */}
      <div className="w-full space-y-1">
        <InfoRow label="Thể loại">
          {movie.categories.map((cate) => (
            <Badge key={cate.id} variant="category">
              {cate.name}
            </Badge>
          ))}
        </InfoRow>

        <InfoRow label="Quốc gia">
          {movie.countries.map((c) => (
            <Badge key={c.id} variant="category">
              {c.name}
            </Badge>
          ))}
        </InfoRow>

        <InfoRow label="Chất lượng">
          <Badge variant="category" className={getBadgeColor("quality")}>
            {movie.quality}
          </Badge>
        </InfoRow>

        <InfoRow label="Ngôn ngữ">
          <Badge variant="category" className={getBadgeColor("lang")}>
            {movie.lang}
          </Badge>
        </InfoRow>

        <InfoRow label="Só tập">
          <Badge variant="category" className={getBadgeColor("default")}>
            {movie.episodeTotal}
          </Badge>
        </InfoRow>
      </div>

      {/* Giới thiệu */}
      <div className="mt-6 w-full border-t border-slate-700 pt-4 text-primary">
        <span className="mb-3 block text-lg font-semibold text-yellow-400">
          Nội dung phim
        </span>
        <p className="text-justify leading-relaxed opacity-90">
          {formatContent(movie.content || "Đang cập nhật...")}
        </p>
      </div>
    </div>
  )
}

export default MovieInfoSide
