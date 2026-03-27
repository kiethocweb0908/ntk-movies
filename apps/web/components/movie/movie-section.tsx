// apps/web/components/movie-section.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { SectionHeading } from "./section-heading"
import { MovieCard } from "./movie-card"

interface MovieSectionProps {
  title: string
  movies: MovieResponse[]
}

export const MovieSection = ({ title, movies }: MovieSectionProps) => {
  if (!movies || movies.length === 0) return null

  return (
    <section className="flex rounded-xl bg-slate-900 lg:p-8">
      <SectionHeading title={title} />

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {movies.map((movie, index) => (
            <CarouselItem
              key={movie.id}
              className="basis-1/2 pl-4 select-none md:basis-1/4 lg:basis-1/6"
            >
              <MovieCard movie={movie} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Đưa nút bấm vào trong để giống ảnh 1 */}
        <CarouselPrevious className="left-2 border-none bg-black/50 text-white hover:bg-black" />
        <CarouselNext className="right-2 border-none bg-black/50 text-white hover:bg-black" />
      </Carousel>
    </section>
  )
}
