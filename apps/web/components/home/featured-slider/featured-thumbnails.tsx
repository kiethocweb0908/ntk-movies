"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"
import { memo } from "react"

interface FeaturedThumbnailProps {
  movies: MovieResponse[]
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
  setProgress: React.Dispatch<React.SetStateAction<number>>
}

const FeaturedThumbnails = memo(
  ({
    movies,
    activeIndex,
    setActiveIndex,
    setProgress,
  }: FeaturedThumbnailProps) => {
    return (
      <div className="group absolute right-1/2 -bottom-8 z-40 grid translate-x-1/2 translate-y-1/2 grid-cols-10 gap-5 lg:w-[80vw]">
        {movies.map((movie, index) => (
          <div
            key={movie.slug}
            onClick={() => {
              setActiveIndex(index)
              setProgress(0)
            }}
            className={`relative aspect-2/3 overflow-hidden rounded-xl border-2 transition-all duration-300 select-none ${activeIndex === index ? "border-primary" : "border-transparent"} hover:-translate-y-5`}
          >
            <Image
              src={IMG_URL + movie.thumbUrl}
              alt={movie.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
    )
  }
)
export default FeaturedThumbnails
