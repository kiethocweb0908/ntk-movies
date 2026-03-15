"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { memo } from "react"

interface HeroBackgroundProps {
  movies: MovieResponse[]
  activeIndex: number
}

const HeroBackground = memo(({ movies, activeIndex }: HeroBackgroundProps) => {
  return (
    <>
      {movies.map((movie, index) => {
        const isNext = index === (activeIndex + 1) % movies.length
        const isPrev =
          index === (activeIndex - 1 + movies.length) % movies.length
        const isActive = index === activeIndex

        if (!isActive && !isNext && !isPrev) return null

        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === activeIndex
                ? "z-10 scale-100 opacity-100"
                : "z-0 scale-105 opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-20 bg-linear-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 z-20 bg-linear-to-t from-black via-transparent to-transparent" />
            <img
              src={IMG_URL + movie.posterUrl}
              alt={movie.name}
              className="h-full w-full object-cover"
            />
          </div>
        )
      })}
    </>
  )
})

export default HeroBackground
