import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { MovieCard } from "./movie-card"

interface MovieListProps {
  movies: MovieResponse[]
  grid?: 4 | 6 | 8
}

const MovieList = ({ movies, grid = 8 }: MovieListProps) => {
  if (!movies.length) return
  const gridConfigs = {
    4: "lg:grid-cols-4",
    6: "lg:grid-cols-6",
    8: "lg:grid-cols-8",
  }

  const gridClass = gridConfigs[grid]
  return (
    <div className={`grid grid-cols-2 gap-5 md:grid-cols-4 ${gridClass}`}>
      {movies.map((movie, index) => (
        <MovieCard key={movie.slug} movie={movie} index={index} />
      ))}
    </div>
  )
}

export default MovieList
