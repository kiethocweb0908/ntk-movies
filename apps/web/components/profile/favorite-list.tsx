"use client"

import useSWRInfinite from "swr/infinite"
import MovieList from "@/components/movie/movie-list"
import { Button } from "@workspace/ui/components/button"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { api } from "@/lib/api"
import { FavoritesResponse } from "@workspace/shared/schema/favorite/favorite.response"
import { MovieCard } from "../movie/movie-card"

const PAGE_SIZE = 18

const FavoriteListClient = () => {
  // Logic lấy Key cho từng trang
  const getKey = (
    pageIndex: number,
    previousPageData: AppResponse<FavoritesResponse> | null
  ) => {
    if (previousPageData && !previousPageData.data!.hasMore) return null
    if (pageIndex === 0) return `/favorite?limit=${PAGE_SIZE}`
    return `/favorite?limit=${PAGE_SIZE}&cursor=${previousPageData?.data!.nextCursor}`
  }

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<
    AppResponse<FavoritesResponse>
  >(
    getKey,
    (url) => api(url), // fetcher
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const allFavorites = data ? data.flatMap((page) => page.data!.favorites) : []
  const hasMore = data ? data[data.length - 1]?.data!.hasMore : false
  const isFetchingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")

  if (isLoading && size === 1)
    return <div className="py-10 text-center">Đang tải phim yêu thích...</div>

  return (
    <div className="overflow-anchor-none flex flex-col gap-10">
      <MovieList
        items={allFavorites}
        grid={6}
        renderItem={(item, index) => (
          <MovieCard key={`${item.id}-${index}`} movie={item} index={index} />
        )}
      />

      {/* Nút Tải thêm */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="filter"
            disabled={isFetchingMore}
            onClick={() => setSize(size + 1)}
            className="max-w-40! cursor-pointer"
          >
            {isFetchingMore ? "Đang lấy thêm phim..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FavoriteListClient
