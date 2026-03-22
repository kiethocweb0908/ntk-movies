"use client"

import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { formatContent } from "@workspace/ui/lib/utils"
import { Heart, Play, Star } from "lucide-react"
import Link from "next/link"
import { DragControls, motion } from "framer-motion"
import { memo } from "react"
import RatingBadge from "@/components/ui/rating-badge"
import ActionButton from "@/components/ui/action-button"

const titleVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const infoVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.2 },
  },
}

const descVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.35 },
  },
}

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.5 },
  },
}

interface FeaturedContentProps {
  currentMovie: MovieResponse
  activeIndex: number
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
  dragControls: DragControls
}

const FeaturedContent = memo(
  ({
    currentMovie,
    activeIndex,
    setPaused,
    dragControls,
  }: FeaturedContentProps) => {
    return (
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="relative z-30 flex h-full w-full touch-none flex-col justify-end p-8 text-white select-none md:justify-center lg:max-w-3xl lg:justify-start"
      >
        <motion.h3
          key={`title-${activeIndex}`}
          variants={titleVariant}
          initial="hidden"
          animate="visible"
          className="mb-2 line-clamp-1 text-4xl font-semibold tracking-tighter sm:text-3xl lg:mb-4 lg:text-5xl"
        >
          {currentMovie.name}
        </motion.h3>
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
          className="mb-5 line-clamp-2 max-w-xl text-sm text-gray-300 md:text-lg lg:mb-6 xl:mb-10 xl:line-clamp-4"
        >
          {formatContent(currentMovie.content!)}
        </motion.p>

        <motion.div
          key={`buttons-${activeIndex}`}
          variants={buttonVariant}
          initial="hidden"
          animate="visible"
          className="flex gap-4"
          onPointerDown={(e) => e.stopPropagation()}
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

export default FeaturedContent
