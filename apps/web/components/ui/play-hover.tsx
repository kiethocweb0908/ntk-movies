import { Play } from "lucide-react"

const PlayHover = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-black shadow-xl">
        <Play className="ml-1 fill-current" size={24} />
      </div>
    </div>
  )
}

export default PlayHover
