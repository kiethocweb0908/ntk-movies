"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import FeaturedBackground from "./featured-background"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import FeaturedContent from "./featured-content"
import FeaturedThumbnails from "./featured-thumbnails"
import { motion, PanInfo, useDragControls } from "framer-motion"
import TitleSection from "@/components/ui/tittle-section"

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
  const controls = useDragControls()

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

  const onDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const x = info.offset.x
    const width = window.innerWidth
    const threshold = width < 768 ? 20 : width < 1024 ? 35 : 50
    if (Math.abs(x) >= threshold) {
      if (x > 0) prevSlide()
      else nextSlide()
    }
    setPaused(false)
  }

  const currentMovie = movies[activeIndex]
  if (!currentMovie) return
  return (
    <div className="mb-20 md:mb-22 lg:mb-35 xl:mb-42">
      <TitleSection tittle={tittle} />

      <motion.div
        drag="x"
        dragListener={false}
        dragControls={controls}
        dragElastic={0}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setPaused(true)}
        onDragEnd={onDragEnd}
        style={{ cursor: "grab" }}
        whileTap={{ cursor: "grabbing" }}
        className="relative aspect-square w-full select-none sm:aspect-video lg:aspect-72/23"
      >
        <FeaturedBackground
          movies={movies}
          activeIndex={activeIndex}
          dragControls={controls}
        />
        <FeaturedContent
          currentMovie={currentMovie}
          activeIndex={activeIndex}
          setPaused={setPaused}
          dragControls={controls}
        />
        <FeaturedThumbnails
          movies={movies}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setProgress={setProgress}
        />
      </motion.div>
    </div>
  )
}

export default FeaturedSlider
