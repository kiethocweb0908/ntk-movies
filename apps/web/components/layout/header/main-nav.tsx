import { api } from "@/lib/api"
import { NavItemWithContent } from "./nav-item"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import { MOVIE_TYPES } from "@/lib/constants"

export async function MainNav() {
  // fetch category và country
  try {
    const [categories, countries] = await Promise.all([
      api<CategoryResponse[]>("/category"),
      api<CountryResponse[]>("/country"),
    ])

    return (
      <div className="hidden items-center text-secondary lg:flex">
        {MOVIE_TYPES.map((type) => (
          <NavItemWithContent
            key={type.slug}
            title={type.name}
            items={
              type.slug === "quoc-gia"
                ? countries
                : type.slug === "the-loai"
                  ? categories
                  : undefined
            }
            href={type.slug}
          />
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="hidden items-center px-4 text-sm font-medium text-primary lg:flex">
        Menu đang bảo trì
      </div>
    )
  }
}
