import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import MovieList from "../../movie-list"
import TitleSection from "@/components/ui/tittle-section"

interface TabRelatedProps {
  related: MovieResponse[]
}

const TabRelated = ({ related }: TabRelatedProps) => {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-semibold">Có thể bạn sẽ thích</h3>
      <MovieList movies={related} grid={4} />
    </div>
  )
}

export default TabRelated
