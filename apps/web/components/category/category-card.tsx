import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CategoryCardProps {
  category: CategoryResponse
  gradient: string
}
const CategoryCard = ({ category, gradient }: CategoryCardProps) => {
  return (
    <Link
      href={`the-loai/${category.slug}`}
      className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-linear-to-br p-2 transition-all duration-300 hover:-translate-y-3 md:aspect-video lg:aspect-square xl:w-full ${gradient}`}
    >
      <h3 className="text-center text-sm leading-tight font-semibold text-white sm:text-lg md:line-clamp-1 md:text-2xl lg:text-lg xl:text-2xl">
        {category.name}
      </h3>
      <div className="hidden items-center gap-1 text-xs text-primary sm:flex md:text-sm lg:text-xs xl:text-sm">
        <span>Xem chủ đề</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  )
}

export default CategoryCard
