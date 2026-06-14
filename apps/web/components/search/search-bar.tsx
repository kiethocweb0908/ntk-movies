"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@workspace/ui/components/input"
import { SearchIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import {
  AppResponse,
  MovieResponse,
  MoviesResponse,
} from "@workspace/shared/schema/movie/movie.response"
import { useDebounce } from "@/hooks/use-debounce"
import SearchResults from "./search-results"
import { cn } from "@workspace/ui/lib/utils"

interface SearchBarProps {
  hidden?: boolean
  setIsOpenMobiel?: React.Dispatch<React.SetStateAction<boolean>>
  onSelectMovie?: (movie: MovieResponse) => void
  limit?: number
}

export default function SearchBar({
  hidden = true,
  setIsOpenMobiel,
  onSelectMovie,
  limit = 5,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MovieResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const debouncedQuery = useDebounce<string>(query, 500)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await api<AppResponse<MoviesResponse>>(
          `/movies?search=${debouncedQuery.trim()}&limit=${limit}`
        )
        const movies = res.data!.movies

        setResults(movies)
        setIsOpen(true)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    searchMovies()
  }, [debouncedQuery])

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim()) return
      if (setIsOpenMobiel) {
        setIsOpenMobiel(false)
      }
      if (!onSelectMovie) {
        setIsOpen(false)
        router.push(`/tim-kiem?q=${encodeURIComponent(query)}`)
        setQuery("")
      }
    },
    [query]
  )

  useEffect(() => {
    if (!hidden && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hidden])

  return (
    <div
      className={cn(
        "relative",
        !onSelectMovie && "sm:w-full sm:max-w-sm md:max-w-md xl:max-w-sm"
      )}
    >
      <form
        onSubmit={handleSearchSubmit}
        className={cn("relative z-20 w-full", hidden && "hidden sm:block")}
      >
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <SearchIcon size={18} />
          )}
        </div>

        <Input
          name="q"
          type={"search"} // a
          value={query}
          ref={inputRef}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên phim cần tìm"
          className="z-50 w-full rounded-md border-none bg-secondary/10 py-6 pl-11 text-secondary placeholder:text-secondary focus-visible:ring-1 focus-visible:ring-secondary"
        />
      </form>

      {/* tấm phủ */}
      {isOpen && query.trim() && (
        <div
          className="fixed inset-0 top-0 z-10 h-screen cursor-default bg-background/0"
          onClick={() => {
            setIsOpen(false)
            setQuery("")
            if (setIsOpenMobiel) {
              setIsOpenMobiel(false)
            }
          }}
        />
      )}

      {/* list phim */}
      {isOpen && query.trim() && (
        <div
          className={cn(
            "absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl sm:w-full",
            onSelectMovie && "custom-scrollbar max-h-75 overflow-y-auto"
          )}
        >
          {/* đang gõ */}
          {loading || query !== debouncedQuery ? (
            <div className="flex justify-center py-10 text-primary">
              <Loader2 className="mr-2 animate-spin" size={18} />
              Đang tìm phim...
            </div>
          ) : (
            <>
              {/* có kết quả */}
              {results.length > 0 ? (
                <SearchResults
                  movies={results}
                  setIsOpen={setIsOpen}
                  setQuery={setQuery}
                  handleSearchSubmit={handleSearchSubmit}
                  onSelectMovie={onSelectMovie}
                />
              ) : (
                // Không tìm thấy phim
                query.trim() && (
                  <div className="py-10 text-center text-primary/60">
                    Không tìm thấy phim liên quan
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
