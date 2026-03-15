import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface NavItemProps {
  title: string
  items: { id: string; name: string; slug: string }[]
  columns?: number
  href: "the-loai" | "quoc-gia"
}

export function NavItemWithContent({ title, items, href }: NavItemProps) {
  const gridColsClass =
    items.length > 12
      ? "md:grid-cols-4 w-140"
      : items.length >= 6
        ? "md:grid-cols-3 w-105"
        : items.length > 4
          ? "md:grid-cols-2 w-70"
          : "md:grid-cols-1 w-35"

  return (
    <div className="group relative px-4 py-2">
      <div className="flex items-center text-sm group-hover:text-textHover">
        {title} <ChevronDown className="h-4 w-4" />
      </div>
      <div className="absolute top-full left-0 hidden rounded-md bg-slate-900 py-3 text-secondary group-hover:block">
        {/* Sử dụng template literal để đưa class vào */}
        <ul className={`grid ${gridColsClass}`}>
          {items.map((item, index) => (
            <li key={index} className="group list-none text-secondary">
              <Link
                href={`/${href}/${item.slug}`}
                className="block cursor-pointer rounded-md px-3 py-3.5 text-sm hover:text-textHover"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
