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
}

const SearchItem = ({
  movie,
  setIsOpen,
  setQuery,
  setIsOpenMobiel,
}: SearchItemProps) => {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push(`/phim/${movie.slug}`)
        setIsOpen(false)
        setQuery("")
        if (setIsOpenMobiel) {
          setIsOpenMobiel(false)
        }
      }}
    >
      <MovieCard isHorizontal={true} movie={movie} />
    </div>
  )
}

export default SearchItem
