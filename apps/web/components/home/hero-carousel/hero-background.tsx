"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { memo } from "react"

interface HeroBackgroundProps {
  movies: MovieResponse[]
  activeIndex: number
}

const HeroBackground = memo(({ movies, activeIndex }: HeroBackgroundProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
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
            className={`absolute inset-0 bg-(image:--bg-mobile) bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out will-change-transform lg:bg-(image:--bg-desktop) ${
              index === activeIndex
                ? "z-10 scale-100 opacity-100"
                : "z-0 scale-105 opacity-0"
            }`}
            style={
              {
                "--bg-mobile": `url(${IMG_URL}${movie.thumbUrl})`,
                "--bg-desktop": `url(${IMG_URL}${movie.posterUrl})`,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-0 z-20 bg-linear-to-r from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 z-20 bg-linear-to-t from-background via-transparent to-transparent" />
            {/* <img
              src={IMG_URL + (isMobile ? movie.posterUrl : movie.thumbUrl)}
              alt={movie.name}
              className="h-full w-full object-cover"
            /> */}
          </div>
        )
      })}
    </>
  )
})

export default HeroBackground
