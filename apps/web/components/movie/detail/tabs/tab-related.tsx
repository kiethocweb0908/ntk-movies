import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import MovieList from "../../movie-list"
import { MovieCard } from "../../movie-card"

interface TabRelatedProps {
  related: MovieResponse[]
}

const TabRelated = ({ related }: TabRelatedProps) => {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-semibold">Có thể bạn sẽ thích</h3>
      <MovieList
        items={related}
        grid={4}
        renderItem={(item, index) => (
          <MovieCard key={item.slug} movie={item} index={index} />
        )}
      />
    </div>
  )
}

export default TabRelated
