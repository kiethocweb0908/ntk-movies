import Link from "next/link"

export const SectionHeading = ({ title }: { title: string }) => {
  return (
    <div className="flex max-w-55 items-start justify-center pr-8 xl:flex-col">
      <h2 className="bg-linear-to-r from-pink-500 via-purple-400 to-yellow-200 bg-clip-text text-xl font-black tracking-tighter text-transparent uppercase italic md:text-2xl xl:text-4xl">
        {title}
      </h2>

      <Link
        href={""}
        className="group flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-white"
      >
        Xem toàn bộ
        <span className="transition-transform group-hover:translate-x-1">
          &gt;
        </span>
      </Link>
    </div>
  )
}
