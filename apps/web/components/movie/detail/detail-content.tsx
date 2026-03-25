import { MovieResponseFull } from "@workspace/shared/schema/movie/movie.response"
import InfoRow from "./info-row"
import { Badge } from "@workspace/ui/components/badge"
import { formatContent, getBadgeColor } from "@workspace/ui/lib/utils"

interface DetailCcontentProps {
  movie: MovieResponseFull
}

const DetailCcontent = ({ movie }: DetailCcontentProps) => {
  return (
    <>
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
    </>
  )
}

export default DetailCcontent
