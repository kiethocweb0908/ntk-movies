"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import { DragControls } from "framer-motion"
import Image from "next/image"
import { memo } from "react"

interface FeaturedBackgroundProps {
  movies: MovieResponse[]
  activeIndex: number
  dragControls: DragControls
}

const FeaturedBackground = memo(
  ({ movies, activeIndex, dragControls }: FeaturedBackgroundProps) => {
    return (
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="absolute inset-0 flex h-full w-full touch-none flex-col-reverse overflow-hidden rounded-2xl lg:flex-row"
      >
        <div className="z-10 h-full basis-1/6 bg-slate-900 lg:basis-1/4"></div>
        <div className="relative basis-5/6 lg:basis-3/4">
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
                <div className="absolute inset-0 z-20 hidden bg-linear-to-r from-slate-900 to-transparent lg:block" />
                <div className="absolute inset-0 z-20 block bg-linear-to-t from-slate-900 via-0% to-transparent lg:hidden" />
                <Image
                  src={IMG_URL + movie.posterUrl}
                  alt={movie.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="h-full w-full object-cover"
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default FeaturedBackground
