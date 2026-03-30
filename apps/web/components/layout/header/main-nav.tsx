import { NavItemWithContent } from "./nav-item"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import { MOVIE_TYPES } from "@/lib/constants"

interface MainNavProps {
  categories: CategoryResponse[]
  countries: CountryResponse[]
}

export function MainNav({ categories, countries }: MainNavProps) {
  return (
    <div className="hidden items-center text-secondary xl:flex">
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
}
