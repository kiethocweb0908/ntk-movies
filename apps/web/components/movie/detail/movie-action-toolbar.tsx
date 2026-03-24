import Link from "next/link"
import { Eye, Heart, MessageCircleMore, Play, Plus, Share2 } from "lucide-react"
import ActionItem from "./action-item"

interface MovieActionToolbarProps {
  viewCount: number
}

const MovieActionToolbar = ({ viewCount }: MovieActionToolbarProps) => {
  return (
    <div className="flex w-full items-center justify-between p-8">
      <div className="flex flex-1 items-center gap-6">
        <Link
          href={``}
          className="flex w-50 cursor-pointer items-center justify-center gap-4 rounded-full bg-linear-to-r from-yellow-400 to-yellow-100 px-4 py-4! text-lg font-semibold text-black transition-colors hover:bg-gray-200 sm:px-6 md:px-8 md:py-3"
        >
          <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
        </Link>

        {/* Các nút tương tác */}
        <div className="flex items-center gap-6 border-l border-slate-700 pl-8">
          <ActionItem icon={Heart} label="Yêu thích" />
          <ActionItem icon={Plus} label="Thêm vào" />
          <ActionItem icon={Share2} label="Chia sẻ" />
          <ActionItem icon={MessageCircleMore} label="Bình luận" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="mx-2 hidden h-10 w-px bg-slate-700 md:block" />
        <ActionItem
          icon={Eye}
          label={viewCount.toLocaleString()}
          className="cursor-default! hover:text-white"
        />
      </div>
    </div>
  )
}

export default MovieActionToolbar
