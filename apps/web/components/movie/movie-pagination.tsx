"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { cn } from "@workspace/ui/lib/utils"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Props {
  totalPages: number
  currentPage: number
}

const WINDOW_SIZE = 6

const MoviePagination = ({ totalPages, currentPage }: Props) => {
  const searchParams = useSearchParams()
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024 ? 6 : 4
    }
    return 6
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const mediaQuery = window.matchMedia("(min-width: 1024px)")

    const handleChange = () => {
      setWindowSize(mediaQuery.matches ? 6 : 4)
    }

    handleChange() // set lần đầu
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  if (!isMounted) return null

  const createPageURL = (pageNumber: number | string) => {
    if (pageNumber === currentPage) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  const getPageNumbers = (windowSize: number) => {
    const pages = []
    // const windowSize = 6
    const half = Math.floor(windowSize / 2)

    if (totalPages <= windowSize + 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    let start = currentPage - half + 1
    let end = currentPage + half

    if (start <= half || currentPage <= 4) {
      start = 1
      end = windowSize + 2
    }

    if (end > totalPages - half || totalPages - 4 <= currentPage) {
      end = totalPages
      start = end - (windowSize + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push("ellipsis-start")
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("ellipsis-end")
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null
  const pageNumbers = getPageNumbers(windowSize)

  return (
    <Pagination className="my-10">
      <PaginationContent className="gap-1 lg:gap-3">
        {pageNumbers.map((page, index) => (
          <PaginationItem
            key={typeof page === "number" ? page : `${page}-${index}`}
          >
            {typeof page === "string" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                className={cn(
                  "h-10 min-w-10 text-xs font-semibold transition-all duration-200 ease-in lg:text-sm",
                  "hover:border-textHover hover:bg-textHover hover:text-background",
                  currentPage === page
                    ? "scale-110 border-textHover text-textHover shadow-lg lg:scale-115"
                    : "border-primary/40 bg-transparent"
                )}
              >
                {page === 1 && currentPage > WINDOW_SIZE
                  ? "Đầu"
                  : page === totalPages &&
                      currentPage < totalPages - WINDOW_SIZE + 1
                    ? "Cuối"
                    : page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  )
}

export default MoviePagination
