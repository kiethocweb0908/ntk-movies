"use client"

import MovieRow from "../movie/movie-row"
import useSWR from "swr"
import { api } from "@/lib/api"
import UserInfo from "./user-info"
import HistoryCard from "./history-card"
import { MovieCard } from "../movie/movie-card"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { HistoriesResponse } from "@workspace/shared/schema/history/history.response"
import { FavoritesResponse } from "@workspace/shared/schema/favorite/favorite.response"

interface Profile {}

const Profile = () => {
  // 1. Fetch History
  const { data: historyRes, isLoading: historyLoading } = useSWR(
    "/history?limit=10",
    (url) => api<AppResponse<HistoriesResponse>>(url), // Ép kiểu cho API
    { revalidateOnFocus: false }
  )

  // 2. Fetch Favorites
  const { data: favRes, isLoading: favLoading } = useSWR(
    "/favorite?limit=10",
    (url) => api<AppResponse<FavoritesResponse>>(url),
    { revalidateOnFocus: false }
  )

  const historiesData = historyRes?.data?.histories || []
  const favoritesData = favRes?.data?.favorites || []

  return (
    <div className="flex flex-col gap-8 pb-10">
      <UserInfo />

      {/* Lịch sử xem */}
      {historiesData.length > 0 && (
        <MovieRow
          title="Phim bạn đã xem"
          path="/lich-su"
          items={historiesData}
          isCountry={false}
          renderItem={(item) => <HistoryCard data={item} />}
        />
      )}

      {/* Phim yêu thích */}
      {favoritesData.length > 0 && (
        <MovieRow
          title="Phim bạn yêu thích"
          path="/yeu-thich"
          isCountry={false}
          items={favoritesData}
          renderItem={(item, index) => (
            <MovieCard movie={item} index={index} variantImg="horizontal" />
          )}
        />
      )}
    </div>
  )
}
export default Profile
