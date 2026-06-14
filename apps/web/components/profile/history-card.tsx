import Link from "next/link"
import { IMG_URL } from "@workspace/ui/lib/config"
import PlayHover from "../ui/play-hover"

interface HistoryCardProps {
  data: any
}

const HistoryCard = ({ data }: HistoryCardProps) => {
  const { movie, history, episode } = data
  const progress = history.progress ?? 0

  return (
    <Link
      href={`/xem-phim/${movie.slug}/${episode.slug}?serverId=${episode.serverId}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5"
    >
      {/* Phần Hình ảnh (Poster/Thumb) */}
      <div className="relative aspect-3/2 w-full overflow-hidden">
        <img
          src={IMG_URL + movie.posterUrl}
          alt={movie.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Lớp phủ khi hover */}
        <PlayHover />

        {/* Badge tập phim đang xem */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 rounded-md bg-yellow-500 px-2 py-1 text-[10px] font-extrabold text-black uppercase shadow-md md:flex-row md:gap-2">
          <span>Tập {episode.name}</span>
          <span className="hidden font-serif md:block">/</span>
          <span>{episode.serverName}</span>
        </div>

        {/* Trạng thái đã hoàn thành hay chưa */}
        {history.isCompleted && (
          <div className="absolute top-2 right-2 rounded-md bg-green-500 px-2 py-1 text-[10px] font-extrabold text-white uppercase shadow-md">
            Đã xong
          </div>
        )}
      </div>

      {/* Phần Thông tin phim */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-yellow-500">
          {movie.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] font-medium text-slate-400">
          {movie.originName || "Đang cập nhật..."}
        </p>

        {/* Thanh Progress Bar chuyên dụng */}
        <div className="mt-auto pt-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-yellow-500">{progress}%</span>
            <span className="text-slate-500">
              {history.isCompleted ? "Xem lại" : "Tiếp tục"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HistoryCard
