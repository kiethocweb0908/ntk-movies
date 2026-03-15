"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Plus,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"

const titleVariant = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const infoVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.2 },
  },
}

const descVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.35 },
  },
}

const buttonVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.5 },
  },
}

const url = "https://img.ophim.live/uploads/movies/"

const MovieHeroCarousel = ({ movies }: { movies: MovieResponse[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const dragStart = useRef(0)
  const isDragging = useRef(false)
  const isAnimatingRef = useRef(false)
  const [paused, setPaused] = useState(false)

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

  const getVisibleThumbnails = () => {
    const visible = []
    for (let i = -2; i <= 2; i++) {
      let index = (activeIndex + i + movies.length) % movies.length
      visible.push({ movie: movies[index], relativePos: i, index })
    }
    return visible
  }

  const handleTouchStart = (e: any) => {
    dragStart.current = e.touches[0].clientX
    isDragging.current = true
  }

  const handleTouchMove = (e: any) => {
    if (!isDragging.current) return

    const diff = dragStart.current - e.touches[0].clientX

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
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black font-sans text-white select-none lg:flex-row"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 z-50 h-1 w-full bg-white/10">
        <div
          className="h-full bg-red-600 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Background Images */}
      {movies.map((movie, index) => (
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
            src={url + movie.posterUrl}
            alt={movie.name}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Content Section */}
      <div className="relative z-30 flex h-full max-w-4xl -translate-y-1/10 flex-col justify-end px-4 sm:-translate-y-1/7 md:-translate-y-1/10 md:px-24">
        <motion.h1
          key={`title-${activeIndex}`}
          variants={titleVariant}
          initial="hidden"
          animate="visible"
          className="mb-2 line-clamp-3 text-4xl font-black tracking-tighter sm:text-5xl md:text-8xl lg:mb-4"
        >
          {currentMovie.name}
        </motion.h1>

        <motion.div
          key={`info-${activeIndex}`}
          variants={infoVariant}
          initial="hidden"
          animate="visible"
          className="mb-3 flex flex-wrap items-center gap-4 text-xs font-semibold md:mb-6 md:text-sm"
        >
          <div className="flex items-center gap-1 rounded bg-yellow-500 px-2 py-0.5 text-black">
            <Star size={14} fill="currentColor" />
            <span>{currentMovie.imdb_vote_average.toString()}</span>
          </div>
          <span className="rounded border border-white/30 px-1 py-0.5 text-blue-400 md:px-2">
            TMDB {currentMovie.tmdb_vote_average.toString()}
          </span>
          <span className="text-white/60">•</span>
          {currentMovie.categories.map((cate, index) => (
            <span key={index}>{cate.name}</span>
          ))}
          <span className="text-white/60">•</span>
          <span>{currentMovie.time}</span>
        </motion.div>

        <motion.p
          key={`desc-${activeIndex}`}
          variants={descVariant}
          initial="hidden"
          animate="visible"
          className="mb-5 line-clamp-2 max-w-xl text-sm text-gray-300 md:mb-10 md:text-lg lg:line-clamp-5"
        >
          {currentMovie.content}
        </motion.p>

        <motion.div
          key={`buttons-${activeIndex}`}
          variants={buttonVariant}
          initial="hidden"
          animate="visible"
          className="flex gap-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200 sm:px-6 md:px-8 md:py-3"
          >
            <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
          </button>
          <button
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/20 sm:px-6 md:px-8 md:py-3"
          >
            <Heart size={20} /> Yêu thích
          </button>
        </motion.div>
      </div>

      {/* Thumbnail Section - Compact Overlapping Aligned */}
      <div className="right-6 bottom-10 z-40 w-full md:right-24 md:max-w-142.5 lg:absolute">
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
            const isCenter = relativePos === 0
            const isNear = Math.abs(relativePos) === 1
            const zIndex = 30 - Math.abs(relativePos) * 5
            if (!movie) return
            return (
              <div
                key={`thumb-${movie.id}-${index}`}
                onClick={() => {
                  setActiveIndex(index)
                  setProgress(0)
                }}
                className={`relative shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-500 select-none ${isCenter ? "h-35 w-24 scale-110 shadow-2xl brightness-110 sm:h-41.25 sm:w-30 md:h-48.25 md:w-35" : ""} ${isNear ? "h-31 w-20 opacity-75 brightness-75 sm:h-35 sm:w-25 md:h-40 md:w-28.75" : ""} ${Math.abs(relativePos) === 2 ? "h-22 w-16 opacity-50 brightness-50 sm:h-27.5 sm:w-20 md:h-32.5 md:w-23.75" : ""} `}
                style={{
                  zIndex,
                  transform: `translateX(${relativePos * -20}px)`,
                }}
              >
                <img
                  src={url + movie.thumbUrl}
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
    </div>
  )
}

export default MovieHeroCarousel
