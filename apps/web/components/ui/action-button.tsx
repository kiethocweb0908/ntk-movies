"use client"

import { useFavorite } from "@/hooks/use-favorite"
import { useAuthStore } from "@/store/use-auth-store"
import { Movie_URL, Movie_WATCH } from "@workspace/ui/lib/config"
import { cn } from "@workspace/ui/lib/utils"
import { Heart, Info, Play } from "lucide-react"
import Link from "next/link"

interface ActionButtonProps {
  variant: "play" | "favorite" | "info"
  path?: string
  size?: "full" | "normal"
  movieId?: string
}

const ActionButton = ({
  variant = "favorite",
  path,
  size = "normal",
  movieId,
}: ActionButtonProps) => {
  const sizeClass =
    size === "normal"
      ? "gap-2 px-4 py-2 text-sm sm:px-6 md:px-8 md:py-3"
      : "text-lg w-full sm:w-50 sm:px-6 md:w-60 md:px-8 md:py-3 lg:w-80 xl:w-50 px-4 py-4!"
  if (variant === "play")
    return (
      <Link
        href={`${Movie_WATCH}/${path}`}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-4 rounded-full bg-linear-to-r from-yellow-400 to-yellow-100 font-semibold text-black transition-colors hover:to-yellow-200",
          sizeClass
        )}
      >
        <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
      </Link>
    )

  const className =
    "flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/20 sm:px-6 md:py-3 md:px-4"

  if (variant === "info") {
    return (
      <Link href={`${Movie_URL}/${path}`} className={className}>
        <Info size={20} />
        <span className="hidden sm:block">Thông tin</span>
      </Link>
    )
  }

  if (variant === "favorite") {
    const { isFavourited, handleToggleFavorite } = useFavorite(movieId)

    return (
      <button className={className} onClick={handleToggleFavorite}>
        <Heart
          size={20}
          fill={isFavourited ? "#ff4d4f" : "transparent"}
          color={isFavourited ? "#ff4d4f" : "currentColor"}
          className={isFavourited ? "drop-shadow-sm" : "opacity-80"}
        />
      </button>
    )
  }
}

export default ActionButton
