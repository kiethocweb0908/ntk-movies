import Link from "next/link"
import { Eye, Heart, MessageCircleMore, Play, Plus, Share2 } from "lucide-react"
import ActionItem from "./action-item"
import ActionButton from "@/components/ui/action-button"

interface MovieActionToolbarProps {
  viewCount: number
  slugMovie: string
}

const MovieActionToolbar = ({
  viewCount,
  slugMovie,
}: MovieActionToolbarProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-6 p-5 sm:flex-row sm:gap-5 lg:p-8">
      <ActionButton variant="play" path={slugMovie} size="full" />
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
