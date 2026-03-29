import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
      className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-white/5"
    >
      <div className="relative aspect-3/2 h-18">
        <Image
          src={IMG_URL + movie.posterUrl}
          alt={movie.name}
          fill
          sizes="100px"
          className="rounded object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="line-clamp-1 text-sm font-medium text-white group-hover:text-textHover">
          {movie.name}
        </span>
        <span className="text-xs text-primary/80 group-hover:text-textHover/60">
          {movie.originName}
        </span>
      </div>
    </div>
  )
}

export default SearchItem
