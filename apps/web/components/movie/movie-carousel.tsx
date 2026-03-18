import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { MovieCard } from "./movie-card"

const MovieCarousel = ({ movies }: { movies: MovieResponse[] }) => {
  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent className="-ml-1 cursor-grab">
        {movies.map((movie, index) => (
          <CarouselItem
            key={index}
            //   className="pl-1 lg:basis-1/4"
            className="basis-1/2 pl-1 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
          >
            <div className="relative p-1">
              <MovieCard movie={movie} variant="horizontal" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-1/3 -left-6 -translate-y-1/2 border-none bg-secondary p-6 text-secondary-foreground transition-opacity duration-300 hover:bg-primary active:-translate-y-1/2 disabled:opacity-0 lg:translate-y-0 lg:active:translate-y-0 xl:top-1/2 xl:-translate-y-full xl:active:-translate-y-full" />
      <CarouselNext className="top-1/3 -right-6 -translate-y-1/2 border-none bg-secondary p-6 text-secondary-foreground transition-opacity duration-300 hover:bg-primary active:-translate-y-1/2 disabled:opacity-0 lg:translate-y-0 lg:active:translate-y-0 xl:top-1/2 xl:-translate-y-full xl:active:-translate-y-full" />
    </Carousel>
  )
}

export default MovieCarousel
