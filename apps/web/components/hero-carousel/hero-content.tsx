"use client"

import { motion } from "framer-motion"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { Heart, Play, Star } from "lucide-react"
import { formatContent } from "@workspace/ui/lib/utils"
import { memo } from "react"
import Link from "next/link"

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

interface HeroContentProps {
  currentMovie: MovieResponse
  activeIndex: number
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
}

const HeroContent = memo(
  ({ currentMovie, activeIndex, setPaused }: HeroContentProps) => {
    return (
      <div className="relative z-30 flex h-full max-w-4xl -translate-y-1/10 flex-col justify-end px-4 sm:-translate-y-1/7 sm:px-10 md:-translate-y-1/10 md:px-15 xl:px-13">
        <motion.h1
          key={`title-${activeIndex}`}
          variants={titleVariant}
          initial="visible"
          animate="visible"
          className="mb-2 line-clamp-3 text-4xl font-black tracking-tighter sm:text-5xl lg:mb-4 lg:text-8xl"
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
            <span>{currentMovie.imdb_vote_average!.toString()}</span>
          </div>
          <span className="rounded border border-white/30 px-1 py-0.5 text-blue-400 md:px-2">
            TMDB {currentMovie.tmdb_vote_average!.toString()}
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
          {formatContent(currentMovie.content!)}
        </motion.p>

        <motion.div
          key={`buttons-${activeIndex}`}
          variants={buttonVariant}
          initial="hidden"
          animate="visible"
          className="flex gap-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Link
            href={`/thong-tin-phim/${currentMovie.slug}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200 sm:px-6 md:px-8 md:py-3"
          >
            <Play fill="currentColor" className="size-4 md:size-5" /> Xem ngay
          </Link>
          <button
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/20 sm:px-6 md:px-8 md:py-3"
          >
            <Heart size={20} /> Yêu thích
          </button>
        </motion.div>
      </div>
    )
  }
)

export default HeroContent
