"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"
import { memo, useCallback } from "react"

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
    const handleSelect = useCallback(
      (index: number) => {
        setActiveIndex(index)
        setProgress(0)
      },
      [setActiveIndex, setProgress]
    )

    return (
      <div className="group absolute right-1/2 -bottom-8 z-40 grid translate-x-1/2 translate-y-1/2 grid-cols-10 gap-5 sm:gap-3 lg:w-[80vw] lg:gap-5">
        {movies.map((movie, index) => (
          <div
            key={movie.slug}
            onClick={() => handleSelect(index)}
            className={`relative aspect-square w-3 rounded-full transition-all duration-300 select-none md:w-4 lg:aspect-2/3 lg:w-auto lg:overflow-hidden lg:rounded-xl lg:border-2 ${activeIndex === index ? "border-primary bg-primary" : "border-transparent bg-slate-400 lg:bg-transparent"} lg:hover:-translate-y-5`}
          >
            <Image
              src={IMG_URL + movie.thumbUrl}
              alt={movie.name}
              fill
              sizes="(max-width: 1024px) 1px, 10vw"
              className="hidden object-cover transition-all duration-300 hover:scale-110 lg:block"
            />
          </div>
        ))}
      </div>
    )
  }
)
export default FeaturedThumbnails
