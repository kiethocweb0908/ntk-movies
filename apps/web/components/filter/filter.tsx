"use client"

import { api } from "@/lib/api"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { ArrowRight, FilterIcon, XIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
  MOVIE_SORT_FILTER,
  MOVIE_TYPES_FILTER,
  MOVIE_YEARS_FILTER,
} from "@/lib/constants"
import { Button } from "@workspace/ui/components/button"
import FilterRow from "./filter-row"
import FilterGroup from "./filter-group"
import { useRouter, useSearchParams } from "next/navigation"

interface FilterProps {
  initialFilters: Record<string, string>
}

const Filter = ({ initialFilters }: FilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [countries, setCountries] = useState<CountryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const [filters, setFilters] = useState({
    country: initialFilters.countrySlug || "all",
    category: initialFilters.categorySlug || "all",
    type: initialFilters.type || "all",
    year: initialFilters.year || "all",
    sort: initialFilters.sort || "createdAt",
  })

  // fetch thể loại và quốc gia
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [cats, counts] = await Promise.all([
          api<CategoryResponse[]>("/category"),
          api<CountryResponse[]>("/country"),
        ])
        setCategories(cats)
        setCountries(counts)
      } catch (error) {
        console.error("Lỗi fetch filter:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterData()
  }, [])

  useEffect(() => {
    setFilters({
      country: initialFilters.countrySlug || "all",
      category: initialFilters.categorySlug || "all",
      type: initialFilters.type || "all",
      year: initialFilters.year || "all",
      sort: initialFilters.sort || "createdAt",
    })
  }, [initialFilters])

  const handleApplyFilter = useCallback(() => {
    const params = new URLSearchParams()

    if (filters.category !== "all") params.set("the-loai", filters.category)
    if (filters.country !== "all") params.set("quoc-gia", filters.country)
    if (filters.type !== "all") params.set("loai-phim", filters.type)
    if (filters.year !== "all") params.set("nam", filters.year)
    if (filters.sort !== "createdAt") params.set("sap-xep", filters.sort)
    params.set("trang", "1")

    const newQueryString = params.toString()
    const currentQueryString = searchParams.toString()
    if (newQueryString === currentQueryString) return

    router.push(`/tim-kiem?${newQueryString}`)
    setIsOpen(false)
  }, [filters, searchParams, router])

  const close = () => {
    const isDifferent =
      filters.country !== (initialFilters.countrySlug || "all") ||
      filters.category !== (initialFilters.categorySlug || "all") ||
      filters.type !== (initialFilters.type || "all") ||
      filters.year !== (initialFilters.year || "all") ||
      filters.sort !== (initialFilters.sort || "createdAt")

    if (isDifferent) {
      setFilters({
        country: initialFilters.countrySlug || "all",
        category: initialFilters.categorySlug || "all",
        type: initialFilters.type || "all",
        year: initialFilters.year || "all",
        sort: initialFilters.sort || "createdAt",
      })
    }

    setIsOpen(false)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
        else setIsOpen(true)
      }}
      className="group"
    >
      <CollapsibleTrigger className="flex cursor-pointer items-center gap-1 hover:text-textHover">
        <FilterIcon
          size={17}
          fill="currentColor"
          stroke="currentColor"
          className="group-data-[state=open]:text-textHover"
        />{" "}
        <span className="text-lg tracking-tight">Bộ lọc</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 rounded-xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-md">
        {loading ? (
          <div className="animate-pulse py-10 text-center text-sm text-gray-500">
            Đang tải dữ liệu lọc...
          </div>
        ) : (
          <div className="space-y-6">
            <FilterRow label="Quốc gia">
              <FilterGroup
                items={countries}
                currentValue={filters.country}
                onChange={(val) => setFilters((p) => ({ ...p, country: val }))}
              />
            </FilterRow>

            <FilterRow label="Thể loại">
              <FilterGroup
                items={categories}
                currentValue={filters.category}
                onChange={(val) => setFilters((p) => ({ ...p, category: val }))}
              />
            </FilterRow>

            <FilterRow label="Loại phim">
              <FilterGroup
                items={MOVIE_TYPES_FILTER}
                currentValue={filters.type}
                onChange={(val) => setFilters((p) => ({ ...p, type: val }))}
              />
            </FilterRow>

            <FilterRow label="Năm">
              <Select
                value={filters.year}
                onValueChange={(val) =>
                  setFilters((p) => ({ ...p, year: val }))
                }
              >
                <SelectTrigger className="w-45 border-primary/40">
                  <SelectValue placeholder="Năm phát hành" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-primary">
                  <SelectGroup>
                    <SelectItem key={"all"} value={"all"}>
                      Tất cả
                    </SelectItem>
                    {MOVIE_YEARS_FILTER.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FilterRow>

            <FilterRow label="Sắp xếp">
              <FilterGroup
                items={MOVIE_SORT_FILTER}
                currentValue={filters.sort}
                onChange={(val) => setFilters((p) => ({ ...p, sort: val }))}
                showAll={false}
              />
            </FilterRow>

            {/* nút */}
            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
              <Button variant={"filter"} onClick={handleApplyFilter}>
                Lọc kết quả <ArrowRight size={16} />
              </Button>

              <Button onClick={close} variant="close">
                Đóng <XIcon size={16} />
              </Button>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default Filter
