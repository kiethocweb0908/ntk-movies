import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { MovieCard } from "./movie-card"

interface MovieCarouselProps {
  movies: MovieResponse[]
  variant?: "vertical" | "horizontal"
  isFull?: boolean
}

const MovieCarousel = ({
  movies,
  variant = "horizontal",
  isFull = false,
}: MovieCarouselProps) => {
  if (!movies) return
  console.log(movies)
  const basisClass = isFull
    ? "basis-1/2 sm:basis-1/4 lg:basis-1/6 xl:basis-1/8 "
    : "md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent className="-ml-1 cursor-grab">
        {movies.map((movie, index) => (
          <CarouselItem
            key={index}
            //   className="pl-1 lg:basis-1/4"
            className={`basis-1/2 pl-1 ${basisClass}`}
          >
            <div className="relative p-1">
              <MovieCard movie={movie} variant={variant} index={index} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-1/3 -left-2 -translate-y-1/2 border-none bg-secondary p-4 text-secondary-foreground transition-opacity duration-300 hover:bg-primary active:-translate-y-1/2 disabled:opacity-0 sm:-left-3 lg:-left-3 lg:translate-y-0 lg:p-5 lg:active:translate-y-0 xl:top-1/2 xl:-left-5 xl:-translate-y-full xl:p-6 xl:active:-translate-y-full" />
      <CarouselNext className="top-1/3 -right-2 -translate-y-1/2 border-none bg-secondary p-4 text-secondary-foreground transition-opacity duration-300 hover:bg-primary active:-translate-y-1/2 disabled:opacity-0 sm:-right-3 lg:-right-3 lg:translate-y-0 lg:p-5 lg:active:translate-y-0 xl:top-1/2 xl:-right-5 xl:-translate-y-full xl:p-6 xl:active:-translate-y-full" />
    </Carousel>
  )
}

export default MovieCarousel
