"use client"

import { cn } from "@workspace/ui/lib/utils"

interface FilterItem {
  name: string
  slug: string
}

interface FilterGroupProps {
  items: FilterItem[]
  currentValue: string
  onChange: (slug: string) => void
  showAll?: boolean // Cho phép bật/tắt nút "Tất cả"
}

const FilterGroup = ({
  items,
  currentValue,
  onChange,
  showAll = true,
}: FilterGroupProps) => {
  const allItems = showAll ? [{ name: "Tất cả", slug: "all" }, ...items] : items

  return (
    <>
      {allItems.map((item) => {
        const isActive = currentValue === item.slug

        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onChange(item.slug)}
            className={cn(
              "rounded-md border bg-slate-50/3 px-3 py-1.5 text-xs transition-all",
              isActive
                ? "border-textHover text-textHover"
                : "border-transparent text-white/80 hover:border-primary hover:text-white"
            )}
          >
            {item.name}
          </button>
        )
      })}
    </>
  )
}

export default FilterGroup
