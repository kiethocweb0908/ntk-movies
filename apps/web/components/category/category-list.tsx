import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import CategoryCard from "./category-card"

const GRADIENTS = [
  "from-blue-400 to-purple-600", // Âm nhạc
  "from-teal-400 to-emerald-700", // Cổ trang
  "from-rose-400 to-blue-600", // Gia đình
  "from-orange-400 to-teal-600", // Hài hước
  "from-amber-500 to-red-700", // Hành động
  "from-red-600 to-background", // Kinh dị
  "from-blue-400 to-green-600", // Phiêu lưu
  "from-pink-400 to-rose-500", // Tình cảm
]

interface CategoryListProps {
  categories: CategoryResponse[]
}
const CategoryList = ({ categories }: CategoryListProps) => {
  if (!categories) return null
  return (
    <div className="relative -top-15 z-50">
      <h3 className="mb-5 text-2xl leading-tight font-semibold text-primary md:text-3xl lg:text-2xl xl:text-3xl">
        Bạn quan tâm gì?
      </h3>
      <div className="grid grid-cols-4 gap-5 text-primary lg:grid-cols-8">
        {categories.map((category, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length]
          if (!gradient) return
          return (
            <div key={category.slug}>
              <CategoryCard category={category} gradient={gradient} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryList
