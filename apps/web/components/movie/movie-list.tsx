import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { MovieCard } from "./movie-card"

interface MovieListProps {
  movies: MovieResponse[]
}

const MovieList = ({ movies }: MovieListProps) => {
  if (!movies.length) return
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-8">
      {movies.map((movie) => (
        <MovieCard key={movie.slug} movie={movie} />
      ))}
    </div>
  )
}

export default MovieList
