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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import DetailCcontent from "./detail-content"

interface MovieInfoSideProps {
  movie: MovieResponseFull
}

const MovieInfoSide = ({ movie }: MovieInfoSideProps) => {
  return (
    <div className="xl:-translate-y-40">
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

      {/* Mobile: Dùng Accordion | Desktop: Hiện thẳng luôn */}
      <div className="w-full xl:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="justify-center text-yellow-400 hover:no-underline">
              Xem thông tin chi tiết
            </AccordionTrigger>
            <AccordionContent className="border-t border-slate-700 py-4">
              <DetailCcontent movie={movie} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop: Hiện trực tiếp */}
      <div className="hidden xl:block">
        <DetailCcontent movie={movie} />
      </div>
    </div>
  )
}

export default MovieInfoSide
