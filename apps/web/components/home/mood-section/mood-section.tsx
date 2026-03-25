"use client"
import useSWR from "swr"
import { useState } from "react"

import { API_URL } from "@/lib/api"
import MovieList from "@/components/movie/movie-list"
import TitleSection from "@/components/ui/tittle-section"
import MovieCarousel from "@/components/movie/movie-carousel"

const MOODS = [
  {
    id: "combat",
    label: "Combat cháy máy",
    sub: "Đánh đấm mãn nhãn",
    gradient: "from-orange-400 via-red-700 to-amber-400",
  },
  {
    id: "thao-tung",
    label: "Thao túng tâm lý",
    sub: "Xoắn não đêm khuya",
    gradient: "from-blue-500 via-blue-800 to-cyan-600",
  },
  {
    id: "sinh-ton",
    label: "Sinh tồn khắc nghiệt",
    sub: "nghẹt thở từng giây",
    gradient: "from-green-500 via-emerald-600 to-teal-500",
  },
  {
    id: "cau-luong",
    label: "Cẩu lương ngập mặt",
    sub: "Ngọt hơn đường phèn",
    gradient: "from-rose-400 via-pink-500 to-red-400",
  },
  {
    id: "chua-lanh",
    label: "Trạm sạc chữa lành",
    sub: "Nhẹ lòng ngày mệt mỏi",
    gradient: "from-blue-500 via-teal-600 to-yellow-400",
  },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function MoodSection() {
  const [activeMood, setActiveMood] = useState("combat")

  const { data, error, isLoading } = useSWR(
    `${API_URL}/movies/mood/${activeMood}`,
    fetcher
  )

  if (error) {
    console.log(error)
    return
  }
  const movies = data?.data || []

  return (
    <section className="min-h-100]">
      <TitleSection title="Tâm trạng của bạn" />

      <div>
        <div className="grid grid-cols-5 gap-2 pb-4 lg:gap-5">
          {MOODS.map((mood, index) => (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood.id)}
              className={`${activeMood === mood.id ? "border-primary" : "border-background"} group aspect-auto cursor-pointer rounded-xl border-3 bg-linear-to-br p-2 transition-all duration-300 hover:-translate-y-3 sm:aspect-square lg:aspect-video ${mood.gradient}`}
            >
              <h3 className="text-center text-sm leading-tight font-black text-white sm:text-lg md:line-clamp-1 md:text-2xl lg:text-lg xl:text-2xl">
                {mood.label}
              </h3>
              <span className="hidden text-sm font-semibold text-white lg:block">
                {mood.sub}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="relative min-h-80 w-full transition-all duration-500">
        {isLoading ? (
          <div className="flex h-60 w-full animate-pulse items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 text-lg font-medium text-white/50">
            <span className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Đang "nấu" phim theo tâm trạng của bạn...
            </span>
          </div>
        ) : (
          <MovieCarousel movies={movies} isFull={true} variant="vertical" />
        )}
      </div>
    </section>
  )
}

export default MoodSection
