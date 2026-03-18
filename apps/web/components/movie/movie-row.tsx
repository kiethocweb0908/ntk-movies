import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import MovieCarousel from "./movie-carousel"

interface MovieRowProps {
  tittle: string
  movies: MovieResponse[]
}

const MovieRow = ({ tittle, movies }: MovieRowProps) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-linear-to-t from-transparent from-20% to-[#282b3a] p-4 text-primary lg:p-8 xl:flex-row xl:gap-0">
      {/* tittle */}
      <div className="flex w-full flex-row justify-between gap-2 xl:max-w-54 xl:min-w-54 xl:-translate-y-1/4 xl:flex-col xl:justify-center xl:pr-8">
        <h2 className="flex flex-wrap bg-linear-to-l from-pink-400 to-yellow-100 bg-clip-text text-2xl leading-tight font-semibold tracking-tighter text-transparent xl:text-4xl">
          {tittle}
        </h2>
        <Link
          href={"#"}
          className="flex items-center gap-1 text-sm hover:text-textHover"
        >
          Xem toàn bộ <ArrowRight size={15} />
        </Link>
      </div>

      <MovieCarousel movies={movies} />
    </div>
  )
}

export default MovieRow
