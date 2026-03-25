import Link from "next/link"

interface EpisodeItemProps {
  slug: string
  name: string
  isLast: boolean
  href: string
}

export const EpisodeItem = ({ slug, name, isLast, href }: EpisodeItemProps) => {
  const episodeNumber = name.match(/\d+/) ? name.match(/\d+/)?.[0] : name

  return (
    <Link
      href={href}
      className="group relative flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-[#1e293b]/60 text-sm font-bold text-slate-300 transition-all hover:border-yellow-400 hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]"
    >
      {episodeNumber}
      {isLast && (
        <div className="absolute top-1 right-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
          </span>
        </div>
      )}
    </Link>
  )
}
