import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { MovieCard } from "./movie-card"
import { ReactNode } from "react"

interface MovieListProps<T> {
  items: T[]
  // movies: MovieResponse[]
  grid?: 4 | 6 | 8
  renderItem: (item: T, index: number) => ReactNode
}

const MovieList = <T,>({ items, grid = 8, renderItem }: MovieListProps<T>) => {
  if (!items || !items.length) return
  const gridConfigs = {
    4: "xl:grid-cols-4",
    6: "xl:grid-cols-6",
    8: "xl:grid-cols-8",
  }

  const gridClass = gridConfigs[grid]
  return (
    <div
      className={`grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${gridClass}`}
    >
      {/* {movies.map((movie, index) => (
        <MovieCard key={movie.slug} movie={movie} index={index} />
      ))} */}
      {items.map((item, index) => renderItem(item, index))}
    </div>
  )
}

export default MovieList
