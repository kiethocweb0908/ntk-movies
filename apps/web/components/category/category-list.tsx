import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import CategoryCard from "./category-card"
import TittleSection from "../ui/tittle-section"

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
    <div className="">
      <TittleSection tittle="Bạn quan tâm gì?" />

      <div className="grid grid-cols-4 gap-4 text-primary lg:grid-cols-8 lg:gap-5">
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
