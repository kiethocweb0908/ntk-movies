import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"
import React from "react"

interface MovieThumbnailProps {
  thumbUrl: string
  name: string
}

const MovieThumbnail = ({ thumbUrl, name }: MovieThumbnailProps) => {
  return (
    <div className="relative mb-4 aspect-2/3 w-2/5 overflow-hidden rounded-xl border-4 border-slate-900 sm:w-1/4 lg:w-1/5 xl:w-2/5">
      <Image
        src={IMG_URL + thumbUrl}
        alt={name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
        priority
        className="object-cover transition-all duration-500 ease-linear group-hover:scale-110"
      />
    </div>
  )
}

export default MovieThumbnail
