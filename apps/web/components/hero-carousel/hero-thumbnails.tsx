"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { memo } from "react"

interface HeroThumbnailsProps {
  movies: MovieResponse[]
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  setProgress: React.Dispatch<React.SetStateAction<number>>
  nextSlide: () => void
  prevSlide: () => void
}

const HeroThumbnails = memo(
  ({
    movies,
    activeIndex,
    setActiveIndex,
    setProgress,
    nextSlide,
    prevSlide,
  }: HeroThumbnailsProps) => {
    const getVisibleThumbnails = () => {
      console.log("getVisibleThumbnails")
      const visible = []
      for (let i = -2; i <= 2; i++) {
        let index = (activeIndex + i + movies.length) % movies.length
        visible.push({ movie: movies[index], relativePos: i, index })
      }
      return visible
    }

    return (
      <div className="bottom-10 z-40 w-full md:mx-auto lg:absolute lg:hidden lg:max-w-142.5 xl:right-24 xl:block">
        {/* Navigation Header */}
        <div className="flex items-center justify-between px-2 lg:mb-4">
          <div className="relative mr-4 h-0.5 grow overflow-hidden bg-white/20">
            <div
              className="absolute top-0 left-0 h-full bg-white/60 transition-all duration-500"
              //   style={{
              //     width: "40%",
              //     transform: `translateX(${(activeIndex / (movies.length - 1)) * 150}%)`,
              //   }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="rounded-full border border-white/20 p-1.5 transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full border border-white/20 p-1.5 transition-colors hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Overlapping Thumbnails */}
        <div className="flex items-center justify-center gap-2 overflow-visible px-2 py-4 md:gap-4 lg:min-h-56.25">
          {getVisibleThumbnails().map(({ movie, relativePos, index }) => {
            if (!movie) return
            const isCenter = relativePos === 0
            const isNear = Math.abs(relativePos) === 1
            const zIndex = 30 - Math.abs(relativePos) * 5
            return (
              <div
                key={`thumb-${movie.id}-${index}`}
                onClick={() => {
                  setActiveIndex(index)
                  setProgress(0)
                }}
                className={`relative shrink cursor-pointer overflow-hidden rounded-lg transition-all duration-500 select-none lg:shrink-0 ${isCenter ? "h-35 w-24 scale-110 shadow-2xl brightness-110 sm:h-41.25 sm:w-30 md:h-48.25 md:w-35" : ""} ${isNear ? "h-31 w-20 opacity-75 brightness-75 sm:h-35 sm:w-25 md:h-40 md:w-28.75" : ""} ${Math.abs(relativePos) === 2 ? "h-22 w-16 opacity-50 brightness-50 sm:h-27.5 sm:w-20 md:h-32.5 md:w-23.75" : ""} `}
                style={{
                  zIndex,
                  transform: `translateX(${relativePos * -20}px)`,
                }}
              >
                <img
                  src={IMG_URL + movie.thumbUrl}
                  alt={movie.name}
                  className="h-full w-full object-cover"
                />
                {isCenter && (
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 via-transparent to-transparent p-2">
                    <span className="w-full truncate text-center text-[10px] font-bold md:text-xs">
                      {movie.name}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default HeroThumbnails
