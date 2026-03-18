import CategoryList from "@/components/category/category-list"
import HeroCarsousel from "@/components/hero-carousel/hero-carousel"
import MovieRow from "@/components/movie/movie-row"
import { api } from "@/lib/api"
import { MovieHome } from "@workspace/shared/schema/movie/movie.response"
import { Button } from "@workspace/ui/components/button"

export default async function Page() {
  const res = await api<MovieHome>("/movies/home", {
    next: { revalidate: 3600 },
  })

  const { categories, chienese, chieurap, hero, horror, korean, usuk } =
    res.data

  return (
    <div className="min-h-1000 bg-background">
      {/* <MovieHeroCarousel movies={res} /> */}
      <HeroCarsousel movies={hero} />
      <div className="space-y-5 px-5">
        <CategoryList categories={categories} />
        <MovieRow tittle="Phim Hàn Quốc mới" movies={korean} />
        <MovieRow tittle="Phim Trung Quốc mới" movies={chienese} />
        <MovieRow tittle="Phim US-UK mới" movies={usuk} />
        <MovieRow tittle="Phim Chiếu Rạp" movies={chieurap} />
      </div>
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose"></div>
    </div>
  )
}
