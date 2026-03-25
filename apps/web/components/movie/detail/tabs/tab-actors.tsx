import { ActorResponse } from "@workspace/shared/schema/movie/movie.response"
import { TMDB_IMAGE_BASE } from "@workspace/ui/lib/config"
import { User } from "lucide-react"
import Image from "next/image"

interface TabActorsProps {
  actors: ActorResponse[]
}

const TabActors = ({ actors }: TabActorsProps) => {
  if (!actors || actors.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-slate-500 italic">
        Thông tin diễn viên đang được cập nhật...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {actors.map((actor) => (
        <div
          key={actor.id}
          className="group flex flex-col items-center gap-3 text-center"
        >
          {/* Avatar Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-slate-800 transition-all group-hover:border-yellow-400/50">
            {actor.profile_path ? (
              <Image
                src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                alt={actor.name}
                fill
                sizes="(max-width: 768px) 50vw, 15vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              // Fallback khi không có ảnh
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <User className="size-10 text-slate-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-1 text-sm font-bold text-white group-hover:text-yellow-400">
              {actor.name}
            </span>
            <span className="line-clamp-1 text-xs text-slate-400">
              {actor.role === "Acting" ? actor.character : actor.role || "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TabActors
