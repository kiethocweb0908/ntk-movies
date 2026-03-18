import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { CalendarDays, Clock, Heart, Info, Play, Star } from "lucide-react"
import Image from "next/image"

const MovieDetailPopup = ({ movie }: { movie: MovieResponse }) => {
  return (
    <div className="flex flex-col p-6 text-primary">
      {/* Ảnh nền mờ mờ ở Popup (Giống mẫu) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={IMG_URL + movie.posterUrl}
          fill
          alt="background"
          className="scale-125 object-cover opacity-20 blur-xl"
        />
        <div className="absolute inset-0 bg-linear-to-t from-secondary/80 to-transparent" />
      </div>

      {/* Tên phim lớn */}
      <h2 className="line-clamp-2 text-3xl font-bold tracking-tight text-white">
        {movie.name}
      </h2>
      <p className="mt-1 mb-6 text-sm font-medium tracking-wide text-pink-400">
        {movie.originName}
      </p>

      {/* Nhóm nút hành động */}
      <div className="flex items-center gap-3">
        {/* Nút Xem ngay màu hồng mờ */}
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink-500/20 px-6 py-3.5 text-sm font-bold text-pink-400 shadow-md transition-all hover:bg-pink-500 hover:text-white active:scale-95">
          <Play size={18} fill="currentColor" />
          Xem ngay
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90">
          <Heart size={20} />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90">
          <Info size={20} />
        </button>
      </div>

      {/* Thông tin phụ: IMDB, Năm, Trạng thái */}
      <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-400">
        <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-400">
          <Star size={14} fill="currentColor" className="text-amber-400" />
          IMDb 8.0
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-white">
          <CalendarDays size={14} />
          2025
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
          <Clock size={14} />
          Hoàn tất (8/8)
        </span>
      </div>

      {/* Thể loại (Giống mẫu) */}
      <div className="mt-5 text-[11px] font-medium tracking-wider text-gray-500">
        Hành Động • Hình Sự • Phiêu Lưu
      </div>
    </div>
  )
}
