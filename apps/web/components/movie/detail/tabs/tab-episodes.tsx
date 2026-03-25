"use client"

import { MovieServerResponse } from "@workspace/shared/schema/movie/movie.response"
import { Database } from "lucide-react"
import { Movie_WATCH } from "@workspace/ui/lib/config"
import { EpisodeItem } from "../../episode-item"

interface TabEpisodesProps {
  servers: MovieServerResponse[]
}

const TabEpisodes = ({ servers }: TabEpisodesProps) => {
  if (!servers || servers.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-slate-500 italic">
        Danh sách tập phim đang được cập nhật...
      </div>
    )
  }

  return (
    <div className="flex animate-in flex-col gap-10 duration-700 fade-in">
      {servers.map((server) => (
        <div key={server.id} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-l-4 border-yellow-400 pl-3">
            <Database size={18} className="text-yellow-400 opacity-80" />
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">
              {server.name}
            </h3>
            <span className="ml-2 rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
              {server.episodes.length} tập
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
            {server.episodes.map((ep, index) => (
              <EpisodeItem
                key={ep.slug}
                slug={ep.slug}
                name={ep.name}
                href={`${Movie_WATCH}/${ep.slug}`}
                isLast={index === server.episodes.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TabEpisodes
