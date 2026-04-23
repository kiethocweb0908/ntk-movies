import DetailBackground from "@/components/movie/detail/detail-background"
import MovieActionToolbar from "@/components/movie/detail/movie-action-toolbar"
import MovieInfoSide from "@/components/movie/detail/movie-info-side"
import MovieTabs from "@/components/movie/detail/movie-tabs"
import { api } from "@/lib/api"
import {
  AppResponse,
  MovieDetailResponse,
} from "@workspace/shared/schema/movie/movie.response"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params

  const [res, resActors] = await Promise.all([
    api<AppResponse<MovieDetailResponse>>(`/movies/detail/${slug}`, {
      next: { revalidate: 3600 },
    }),
    fetch(`https://ophim1.com/v1/api/phim/${slug}/peoples`, {
      next: { revalidate: 604800 },
    }).catch(() => null),
  ])
  let actors = []
  if (resActors && resActors.ok) {
    const dataActors = await resActors.json().catch(() => null)
    actors = dataActors?.data?.peoples || []
  }

  const { movie, related, servers } = res.data!
  return (
    <main className="">
      <DetailBackground poster={movie.posterUrl} />
      <div className="flex flex-col bg-background text-white sm:gap-5 xl:flex-row xl:px-5">
        {/* left */}
        <div className="relative w-full rounded-2xl bg-slate-900/40 px-5 pt-5 pb-0 lg:p-8 xl:basis-1/3">
          <MovieInfoSide movie={movie} />
        </div>

        {/* right */}
        <div className="relative w-full rounded-2xl bg-slate-900/40 xl:basis-2/3">
          <MovieActionToolbar
            viewCount={movie.viewCount}
            slugMovie={movie.slug}
            movieId={movie.id}
          />
          <MovieTabs
            actors={actors}
            related={related}
            servers={servers}
            trailerUrl={movie.trailerUrl || ""}
            movieSlug={movie.slug}
          />
        </div>
      </div>
    </main>
  )
}

export default MovieDetailsPage
