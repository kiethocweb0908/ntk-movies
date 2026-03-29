import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import SearchItem from "./search-item"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

interface SearchResultsProps {
  movies: MovieResponse[]
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setQuery: React.Dispatch<React.SetStateAction<string>>
  handleSearchSubmit: (e: React.FormEvent) => void
  setIsOpenMobiel?: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchResults = ({
  movies,
  setIsOpen,
  setQuery,
  handleSearchSubmit,
  setIsOpenMobiel,
}: SearchResultsProps) => {
  const router = useRouter()
  return (
    <>
      {movies.map((movie) => (
        <SearchItem
          key={movie.slug}
          movie={movie}
          setIsOpen={setIsOpen}
          setQuery={setQuery}
          setIsOpenMobiel={setIsOpenMobiel}
        />
      ))}
      <div
        onClick={handleSearchSubmit}
        className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1 border-t border-white/5 p-2 text-center text-xs text-primary hover:text-textHover"
      >
        Xem tất cả kết quả <ArrowRight size={18} />
      </div>
    </>
  )
}

export default SearchResults
