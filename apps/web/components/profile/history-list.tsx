"use client"

import useSWRInfinite from "swr/infinite"
import MovieList from "@/components/movie/movie-list"
import HistoryCard from "./history-card"
import { Button } from "@workspace/ui/components/button"
import { HistoriesResponse } from "@workspace/shared/schema/history/history.response"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { api } from "@/lib/api"

const PAGE_SIZE = 18

const HistoryListClient = () => {
  // Logic lấy Key cho từng trang
  const getKey = (
    pageIndex: number,
    previousPageData: AppResponse<HistoriesResponse> | null
  ) => {
    if (previousPageData && !previousPageData.data!.hasMore) return null
    if (pageIndex === 0) return `/history?limit=${PAGE_SIZE}`
    return `/history?limit=${PAGE_SIZE}&cursor=${previousPageData?.data!.nextCursor}`
  }

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<
    AppResponse<HistoriesResponse>
  >(
    getKey,
    (url) => api(url), // fetcher
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false, // Tắt cái này để tránh việc đang cuộn nó tự reset data
    }
  )

  // Nối mảng phim từ các page
  const allHistories = data ? data.flatMap((page) => page.data!.histories) : []
  const hasMore = data ? data[data.length - 1]?.data!.hasMore : false
  const isFetchingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")

  if (isLoading && size === 1)
    return <div className="py-10 text-center">Đang tải lịch sử...</div>

  return (
    <div className="flex flex-col gap-10">
      <MovieList
        items={allHistories}
        grid={6}
        renderItem={(item, index) => (
          <HistoryCard key={`${item.movie.id}-${index}`} data={item} />
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

export default HistoryListClient
