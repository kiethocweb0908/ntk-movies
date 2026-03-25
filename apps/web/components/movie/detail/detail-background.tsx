import { IMG_URL } from "@workspace/ui/lib/config"
import Image from "next/image"

interface DetailBackgroundProps {
  poster: string | null
}

const DetailBackground = ({ poster }: DetailBackgroundProps) => {
  if (!poster) return
  console.log(poster)
  return (
    <div className="group relative aspect-2/1 w-full overflow-hidden select-none sm:aspect-3/1 xl:aspect-4/1">
      <Image
        src={IMG_URL + poster}
        alt={poster}
        fill
        sizes="100vw"
        className="object-cover transition-all duration-500 ease-linear group-hover:scale-105 group-hover:object-top"
        priority
      />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-0% to-transparent" />
    </div>
  )
}

export default DetailBackground
