"use client"

import { useEffect, useState } from "react"
import MovieList from "../movie/movie-list"
import {
  GetRoomsResponse,
  Room,
} from "@workspace/shared/schema/room/room.response"
import RoomCard from "./room-card"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { useApi } from "@/hooks/use-api"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { Button } from "@workspace/ui/components/button"

const PAGE_SIZE = 3

const RoomList = () => {
  const { callApi } = useApi()
  const roomList = useWatchTogetherStore((s) => s.roomList)
  const setRoomList = useWatchTogetherStore((s) => s.setRoomList)
  const hasMore = useWatchTogetherStore((s) => s.hasMore)
  const cursor = useWatchTogetherStore((s) => s.cursor)
  const [isLoading, setIsLoading] = useState(false)

  const getRooms = async (isRefresh = false) => {
    if (isLoading || (!isRefresh && cursor !== null && !hasMore)) return

    setIsLoading(true)
    try {
      const fetchCursor = isRefresh ? "" : cursor || ""
      const res = await callApi<AppResponse<GetRoomsResponse>>(
        `/watch-together/room-list?limit=${PAGE_SIZE}&cursor=${fetchCursor}`
      )

      if (res.data) {
        setRoomList(res.data, isRefresh)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // FIX: Force fetch làm mới list khi mount (Hoặc dùng cờ isRefresh)
  useEffect(() => {
    getRooms(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex w-full flex-col gap-10">
      {roomList.length > 0 ? (
        <MovieList
          items={roomList}
          grid={6}
          renderItem={(item, index) => (
            <RoomCard key={`${item.id}-${index}`} room={item} />
          )}
        />
      ) : (
        <div className="flex h-100 w-full items-center justify-center rounded-xl bg-slate-800/15 p-10 text-primary">
          Chưa có phòng xem chung
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="filter"
            disabled={isLoading}
            onClick={() => getRooms(false)}
            className="max-w-40! cursor-pointer"
          >
            {isLoading ? "Đang lấy thêm phòng xem..." : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default RoomList
