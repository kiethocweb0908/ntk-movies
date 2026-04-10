import Filter from "@/components/filter/filter"
import MovieList from "@/components/movie/movie-list"
import MoviePagination from "@/components/movie/movie-pagination"
import TitleSection from "@/components/ui/tittle-section"
import { api } from "@/lib/api"
import {
  AppResponse,
  MoviesResponse,
} from "@workspace/shared/schema/movie/movie.response"

interface PageProps {
  searchParams: {
    "quoc-gia"?: string
    "the-loai"?: string
    "loai-phim"?: string
    nam?: string
    "sap-xep"?: string
    trang?: string
    [key: string]: string | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const {
    trang = "1",
    "the-loai": category,
    "quoc-gia": country,
    "loai-phim": type,
    nam: year,
    "sap-xep": sort,
    q: search,
  } = await searchParams

  const queryObj: Record<string, string> = {
    page: trang,
    limit: "18",
  }

  if (category) queryObj.categorySlug = category
  if (country) queryObj.countrySlug = country
  if (type) queryObj.type = type
  if (year) queryObj.year = year
  if (sort) queryObj.sort = sort
  if (search) queryObj.search = search

  const queryString = new URLSearchParams(queryObj).toString()

  const {
    data: { meta, movies },
  } = await api<AppResponse<MoviesResponse>>(`/movies?${queryString}`)

  const displayTitle = search
    ? `Tìm kiếm: "${search.replace(/-/g, " ")}"`
    : `Thể loại: ${category?.replace(/-/g, " ") || "tất cả"}, Quốc gia: ${country?.replace(/-/g, " ") || "tất cả"}, Loại phim: ${type?.replace(/-/g, " ") || "tất cả"}, sắp xếp: ${sort?.replace(/-/g, " ") ? "mới nhát" : "lượt xem"}`

  return (
    <main className="px-5 pt-28 text-white">
      <div className="mb-6 flex flex-col">
        <TitleSection title={displayTitle} className="mb-3" />
        <Filter initialFilters={queryObj} />
      </div>
      {movies.length > 0 ? (
        <>
          <MovieList movies={movies} grid={6} />
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
