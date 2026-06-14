import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MovieCard } from "../movie/movie-card"

interface SearchItemProps {
  movie: MovieResponse
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setQuery: React.Dispatch<React.SetStateAction<string>>
  setIsOpenMobiel?: React.Dispatch<React.SetStateAction<boolean>>
  onSelectMovie?: (movie: MovieResponse) => void
}

const SearchItem = ({
  movie,
  setIsOpen,
  setQuery,
  setIsOpenMobiel,
  onSelectMovie,
}: SearchItemProps) => {
  const router = useRouter()

  const handleSelect = () => {
    onSelectMovie ? onSelectMovie(movie) : router.push(`/phim/${movie.slug}`)
    setIsOpen(false)
    setQuery("")
    if (setIsOpenMobiel) setIsOpenMobiel(false)
  }

  return (
    <div onClick={handleSelect}>
      <MovieCard isHorizontal={true} movie={movie} />
    </div>
  )
}

export default SearchItem
