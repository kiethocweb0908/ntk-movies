import Filter from "@/components/filter/filter"
import { MovieCard } from "@/components/movie/movie-card"
import MovieList from "@/components/movie/movie-list"
import MoviePagination from "@/components/movie/movie-pagination"
import TitleSection from "@/components/ui/tittle-section"
import { api } from "@/lib/api"
import { MOVIE_TYPES } from "@/lib/constants"
import {
  AppResponse,
  MoviesResponse,
} from "@workspace/shared/schema/movie/movie.response"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    type: string
    slug?: string
  }>
  searchParams: Promise<{
    trang?: string
    limit?: string
    [key: string]: string | string[] | undefined
  }>
}

const Page = async ({ params, searchParams }: PageProps) => {
  const [{ type, slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])

  // Kiểm tra route
  const currentType = MOVIE_TYPES.find((item) => item.slug === type)
  const isCategoryOrCountry = ["the-loai", "quoc-gia"].includes(type)
  const currentSlug = slug?.[0]
  if (
    (isCategoryOrCountry && !currentSlug) ||
    (!isCategoryOrCountry && currentSlug) ||
    !currentType
  ) {
    notFound()
  }

  const { trang = "1" } = resolvedSearchParams
  const queryObj: Record<string, string> = { page: trang, limit: "18" }

  if (currentSlug) {
    if (type === "the-loai") queryObj.categorySlug = currentSlug
    if (type === "quoc-gia") queryObj.countrySlug = currentSlug
  }

  const typeMapping: Record<string, string> = {
    "phim-le": "single",
    "phim-bo": "series",
    "phim-hoat-hinh": "hoathinh",
  }
  if (typeMapping[type]) queryObj.type = typeMapping[type]

  const queryString = new URLSearchParams(queryObj).toString()

  const res = await api<AppResponse<MoviesResponse>>(`/movies?${queryString}`)
  const { meta, movies } = res.data!

  if (isCategoryOrCountry && movies.length === 0) {
    notFound()
  }

  const displayTitle = currentSlug
    ? `${currentType.name}: ${currentSlug.replace(/-/g, " ")}`
    : currentType.name

  return (
    <main className="px-5 pt-28 text-white">
      <div className="mb-6 flex flex-col">
        <TitleSection title={displayTitle} className="mb-3" />
        <Filter initialFilters={queryObj} />
      </div>
      {movies.length > 0 ? (
        <>
          <MovieList
            items={movies}
            grid={6}
            renderItem={(item, index) => (
              <MovieCard key={item.slug} movie={item} index={index} />
            )}
          />
          <MoviePagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
          />
        </>
      ) : (
        <div className="py-20 text-center opacity-50">
          Không tìm thấy phim nào.
        </div>
      )}
    </main>
  )
}

export default Page
