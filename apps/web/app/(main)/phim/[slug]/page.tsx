import DetailBackground from "@/components/movie/detail/detail-background"
import MovieActionToolbar from "@/components/movie/detail/movie-action-toolbar"
import MovieInfoSide from "@/components/movie/detail/movie-info-side"
import { api } from "@/lib/api"
import {
  AppResponse,
  MovieDetailResponse,
} from "@workspace/shared/schema/movie/movie.response"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function Page({ params }: PageProps) {
  const { slug } = await params

  const {
    data: { movie, servers, actors, related },
    message,
    status,
  } = await api<AppResponse<MovieDetailResponse>>(`/movies/detail/${slug}`)

  return (
    <main className="min-h-screen">
      <DetailBackground poster={movie.posterUrl} />
      <div className="flex gap-5 bg-background px-5 text-white">
        {/* left */}
        <div className="relative basis-1/3 rounded-2xl bg-slate-900/40 p-8">
          <MovieInfoSide movie={movie} />
        </div>
        {/* right */}
        <div className="relative basis-2/3 rounded-2xl bg-slate-900/40">
          <MovieActionToolbar viewCount={movie.viewCount} />
        </div>
      </div>
    </main>
  )
}

export default Page
