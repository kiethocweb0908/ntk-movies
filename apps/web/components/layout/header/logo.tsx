import Link from "next/link"
import { Clapperboard } from "lucide-react"
import Image from "next/image"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold tracking-tighter"
    >
      {/* <Clapperboard className="h-8 w-8 text-secondary" />
      <span className="hidden text-secondary lg:inline-block">
        NTK-<span className="text-secondary">Films</span>
      </span> */}
      <Image
        src="/logo.svg"
        alt="NTK Films Logo"
        width={135}
        height={135}
        className="rounded-lg object-cover"
        priority
      />
    </Link>
  )
}
