"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import HeroProgress from "./hero-progress"
import HeroBackground from "./hero-background"
import HeroContent from "./hero-content"
import HeroThumbnails from "./hero-thumbnails"

const HeroCarsousel = ({ movies }: { movies: MovieResponse[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)

  const dragStart = useRef(0)
  const isDragging = useRef(false)
  const isAnimatingRef = useRef(false)
  const SLIDE_DURATION = 5000

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

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX
    isDragging.current = true
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const diff = dragStart.current - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()
      isDragging.current = false
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const firstTouch = e.touches[0]
    if (!firstTouch) return

    dragStart.current = firstTouch.clientX
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return

    const currentTouch = e.touches[0]
    if (!currentTouch) return

    const diff = dragStart.current - currentTouch.clientX

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide()
      else prevSlide()

      isDragging.current = false
    }
  }

  const currentMovie = movies[activeIndex]
  if (!currentMovie) return

  return (
    <div
      className="relative flex h-[110vh] w-full flex-col overflow-hidden bg-black font-sans text-white select-none lg:flex-row"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Progress Bar */}
      <HeroProgress progress={progress} />

      {/* Background Images */}
      <HeroBackground movies={movies} activeIndex={activeIndex} />

      <div className="relative flex h-screen w-full flex-col lg:flex-row">
        {/* Content Section */}
        <HeroContent
          currentMovie={currentMovie}
          activeIndex={activeIndex}
          setPaused={setPaused}
        />

        {/* Thumbnail Section - Compact Overlapping Aligned */}
        <HeroThumbnails
          movies={movies}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setProgress={setProgress}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
        />
      </div>
    </div>
  )
}

export default HeroCarsousel
