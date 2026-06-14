import { Room } from "@workspace/shared/schema/room/room.response"
import { Badge } from "@workspace/ui/components/badge"
import { IMG_URL } from "@workspace/ui/lib/config"
import { Globe, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import PlayHover from "../ui/play-hover"

interface RoomCardProps {
  room: Room
}

const RoomCard = ({ room }: RoomCardProps) => {
  const { movie } = room

  return (
    <Link href={`/xem-chung/${room.roomCode}`}>
      <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-900 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
        {/* Image Container (Ảnh ngang - Aspect 16/9) */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={IMG_URL + (movie.posterUrl || movie.thumbUrl)}
            alt={movie.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Lớp phủ Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Badge trạng thái (Công khai/Riêng tư) */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={room.isPrivate ? "destructive" : "success"}
              className="flex items-center gap-1"
            >
              {room.isPrivate ? (
                <>
                  <Lock size={12} /> Riêng tư
                </>
              ) : (
                <>
                  <Globe size={12} /> Công khai
                </>
              )}
            </Badge>
          </div>

          {/* Nút Play hiển thị khi hover */}
          {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-12 w-12 text-textHover drop-shadow-lg" />
          </div> */}

          <PlayHover />
        </div>

        {/* Thông tin phòng */}
        <div className="p-3">
          <h3 className="line-clamp-1 text-center text-sm font-bold text-white transition-colors group-hover:text-textHover">
            {room.name || `Phòng của ${movie.name}`}
          </h3>

          <div className="mt-1 space-y-1 text-center text-xs">
            <h5 className="line-clamp-1 font-semibold text-primary group-hover:text-textHover">
              {movie.name}
            </h5>
            <p className="line-clamp-1 text-primary group-hover:text-textHover/60">
              {movie.originName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RoomCard
