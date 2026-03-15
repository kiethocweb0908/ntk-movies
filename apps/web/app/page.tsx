import HeroCarsousel from "@/components/hero-carousel/hero-carousel"
import MovieHeroCarousel from "@/components/HeroSlider"
import { api } from "@/lib/api"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { Button } from "@workspace/ui/components/button"

export default async function Page() {
  const res = await api<MovieResponse[]>("/movies/top-views", {
    next: { revalidate: 3600 },
  })

  return (
    <div className="flex min-h-1000 bg-gray-800">
      {/* <MovieHeroCarousel movies={res} /> */}
      <HeroCarsousel movies={res} />
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        {/* <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div> */}
      </div>
    </div>
  )
}
