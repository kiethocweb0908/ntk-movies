"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import FeaturedBackground from "./featured-background"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import FeaturedContent from "./featured-content"
import FeaturedThumbnails from "./featured-thumbnails"

interface FeaturedSliderProps {
  movies: MovieResponse[]
  tittle: string
}
const FeaturedSlider = ({ movies, tittle }: FeaturedSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const isAnimatingRef = useRef(false)

  const SLIDE_DURATION = 3500

  const nextSlide = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setActiveIndex((prev) => (prev + 1) % movies.length)
    setProgress(0)
    setTimeout(() => {
      isAnimatingRef.current = false
    }, 800)
  }, [movies.length])

  const prevSlide = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length)
    setProgress(0)
    setTimeout(() => {
      isAnimatingRef.current = false
    }, 800)
  }, [movies.length])

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (SLIDE_DURATION / 100)

        if (next >= 100) {
          nextSlide()
          return 0
        }

        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [paused, nextSlide])

  const currentMovie = movies[activeIndex]
  if (!currentMovie) return
  return (
    <div>
      <h3 className="mb-5 text-2xl leading-tight font-semibold text-primary md:text-3xl lg:text-2xl xl:text-3xl">
        {tittle}
      </h3>
      <div className="relative w-full select-none lg:aspect-72/23">
        <FeaturedBackground movies={movies} activeIndex={activeIndex} />
        <FeaturedContent
          currentMovie={currentMovie}
          activeIndex={activeIndex}
          setPaused={setPaused}
        />
        <FeaturedThumbnails
          movies={movies}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setProgress={setProgress}
        />
      </div>
    </div>
  )
}

export default FeaturedSlider
