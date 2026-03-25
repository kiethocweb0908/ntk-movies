import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold tracking-tighter"
    >
      <Image
        src="/logo.svg"
        alt="NTK Films Logo"
        width={135}
        height={40}
        className="h-auto w-25 object-contain lg:w-33.75"
        priority
      />
    </Link>
  )
}
