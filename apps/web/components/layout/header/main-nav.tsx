import { api } from "@/lib/api"
import { NavItemWithContent } from "./nav-item"
import Link from "next/link"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"

const menuList = [
  {
    name: "Phim chiếu rạp",
    slug: "phim-chieu-rap",
  },
  {
    name: "Phim bộ",
    slug: "phim-bo",
  },
  {
    name: "Diễn viên",
    slug: "dien-vien",
  },
  {
    name: "Xem chung",
    slug: "xem-chung",
  },
]

export async function MainNav() {
  // fetch category và country
  const [categories, countries] = await Promise.all([
    api<CategoryResponse[]>("/category"),
    api<CountryResponse[]>("/country"),
  ])

  return (
    <div className="hidden items-center text-secondary lg:flex">
      {/* Dùng chung component cho Thể loại */}
      <NavItemWithContent title="Thể loại" items={categories} href="the-loai" />

      {/* Dùng chung component cho Quốc gia */}
      <NavItemWithContent title="Quốc gia" items={countries} href="quoc-gia" />

      {/* Các mục đơn giản khác */}

      {menuList.map((i) => (
        <Link
          href={`/${i.slug}`}
          key={i.slug}
          className="px-4 py-2 text-sm hover:text-textHover"
        >
          {i.name}
        </Link>
      ))}
    </div>
  )
}
