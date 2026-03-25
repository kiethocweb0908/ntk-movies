import Link from "next/link"
import { Eye, Heart, MessageCircleMore, Play, Plus, Share2 } from "lucide-react"
import ActionItem from "./action-item"

interface MovieActionToolbarProps {
  viewCount: number
}

const MovieActionToolbar = ({ viewCount }: MovieActionToolbarProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-6 p-5 sm:flex-row sm:gap-5 lg:p-8">
      <Link
        href={``}
        className="flex w-full cursor-pointer items-center justify-center gap-4 rounded-full bg-linear-to-r from-yellow-400 to-yellow-100 px-4 py-4! text-lg font-semibold text-black transition-colors hover:bg-gray-200 sm:w-50 sm:px-6 md:w-60 md:px-8 md:py-3 lg:w-80 xl:w-50"
      >
        <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
      </Link>
      <div className="flex w-full flex-1 items-center justify-between">
        {/* Các nút tương tác */}
        <div className="flex flex-1 items-center gap-6 border-slate-700 sm:gap-8 sm:border-l sm:pl-5 md:gap-5">
          <ActionItem icon={Heart} label="Yêu thích" />
          <ActionItem icon={Plus} label="Thêm vào" />
          <ActionItem icon={Share2} label="Chia sẻ" />
          <ActionItem icon={MessageCircleMore} label="Bình luận" />
        </div>

        <div className="flex items-center gap-2 border-slate-700 sm:border-l sm:pl-5">
          <ActionItem
            icon={Eye}
            label={viewCount.toLocaleString()}
            className="cursor-default! hover:text-white"
          />
        </div>
      </div>
    </div>
  )
}

export default MovieActionToolbar
