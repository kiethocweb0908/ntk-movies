import { Movie_URL } from "@workspace/ui/lib/config"
import { Heart, Play } from "lucide-react"
import Link from "next/link"

interface ActionButtonProps {
  variant: "play" | "favorite"
  path?: string
}

const ActionButton = ({ variant, path }: ActionButtonProps) => {
  if (variant === "play")
    return (
      <Link
        href={`${Movie_URL}/${path}`}
        className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200 sm:px-6 md:px-8 md:py-3"
      >
        <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
      </Link>
    )

  return (
    <button className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/20 sm:px-6 md:px-8 md:py-3">
      <Heart size={20} /> Yêu thích
    </button>
  )
}

export default ActionButton
