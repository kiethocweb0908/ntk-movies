"use client"

import { motion } from "framer-motion"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { Heart, Play } from "lucide-react"
import { formatContent } from "@workspace/ui/lib/utils"
import { memo } from "react"
import Link from "next/link"
import RatingBadge from "@/components/ui/rating-badge"
import ActionButton from "@/components/ui/action-button"

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
          initial="hidden"
          animate="visible"
          className="mb-2 line-clamp-3 text-4xl font-black tracking-tighter text-balance sm:text-5xl lg:mb-4 lg:text-8xl"
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
          <RatingBadge
            variant="imdb"
            vote={currentMovie.imdb_vote_average!.toString()}
          />
          <RatingBadge
            variant="tmdb"
            vote={currentMovie.tmdb_vote_average!.toString()}
          />
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
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ActionButton variant="play" path={currentMovie.slug} />
          <ActionButton variant="favorite" />
        </motion.div>
      </div>
    )
  }
)

export default HeroContent
