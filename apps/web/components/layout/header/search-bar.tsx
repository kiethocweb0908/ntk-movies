"use client"

import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("q")
    if (query) router.push(`/search?q=${query}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="relative hidden w-full max-w-62 lg:block xl:max-w-xs"
    >
      <Search
        strokeWidth={1.5}
        className="absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-primary-foreground"
      />
      <Input
        name="q"
        type="search"
        placeholder="Tìm phim phim, diễn viên"
        className="w-full rounded-md border-none bg-secondary/10 py-6 pl-11 text-secondary placeholder:text-secondary focus-visible:ring-1 focus-visible:ring-secondary"
      />
    </form>
  )
}
