import CategoryList from "@/components/category/category-list"
import FeaturedSlider from "@/components/home/featured-slider/featured-slider"
import HeroCarsousel from "@/components/home/hero-carousel/hero-carousel"
import MoodSection from "@/components/home/mood-section/mood-section"
import TopTist from "@/components/home/top-list/top-list"
import MovieRow from "@/components/movie/movie-row"
import { api } from "@/lib/api"
import {
  AppResponse,
  MovieHomeData,
} from "@workspace/shared/schema/movie/movie.response"

export default async function Page() {
  const res = await api<AppResponse<MovieHomeData>>("/movies/home", {
    next: { revalidate: 3600 },
  })

  const {
    categories,
    chienese,
    chieurap,
    topViewChieurap,
    hero,
    horror,
    topViewHorror,
    korean,
    usuk,
  } = res.data

  return (
    <div className="min-h-1000 bg-background">
      {/* <MovieHeroCarousel movies={res} /> */}
      <HeroCarsousel movies={hero} />
      <div className="relative -top-20 z-10 space-y-2 px-4 lg:space-y-5 lg:px-5">
        <CategoryList categories={categories} />
        <MoodSection />
        <MovieRow tittle="Phim Hàn Quốc mới" movies={korean} />
        <MovieRow tittle="Phim Trung Quốc mới" movies={chienese} />
        <MovieRow tittle="Phim US-UK mới" movies={usuk} />
        <FeaturedSlider movies={chieurap} tittle="Phim chiếu rạp mới" />
        <TopTist movies={topViewChieurap} />
        <FeaturedSlider movies={horror} tittle="Phim kinh dị mới" />
        <TopTist movies={topViewHorror} />
      </div>
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose"></div>
    </div>
  )
}
