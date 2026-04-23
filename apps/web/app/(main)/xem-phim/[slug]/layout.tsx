// app/(main)/xem-phim/[slug]/layout.tsx
import MovieWatchInfo from "@/components/movie/watch/movie-watch-info"
import TabActors from "@/components/movie/detail/tabs/tab-actors"
import TabEpisodes from "@/components/movie/detail/tabs/tab-episodes"
import TitleSection from "@/components/ui/tittle-section"
import { api } from "@/lib/api"
import {
  AppResponse,
  MovieDetailResponse,
} from "@workspace/shared/schema/movie/movie.response"

import Link from "next/link"
import WatchSection from "@/components/movie/watch/watch-section"
import { MovieCard } from "@/components/movie/movie-card"

export default async function MovieWatchLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
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
  const topActors = actors.slice(0, 6)

  return (
    <div className="mx-auto min-h-screen px-5 pt-40 pb-5 text-white">
      <TitleSection title={movie.name} />
      {/* 1. Vùng Video Player (Thay đổi theo tập) */}
      <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg bg-background shadow-2xl md:mb-10 md:rounded-xl">
        {children}
      </div>

      {/* 2. Thông tin phim & Danh sách tập (Cố định) */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <MovieWatchInfo movie={movie} />

          <WatchSection titlePosition="outside" title="Danh sách tập phim">
            <TabEpisodes movieSlug={slug} servers={servers} />
          </WatchSection>
        </div>

        {/* 3. diễn viên và gợi ý phim */}
        <div className="space-y-6">
          <WatchSection title="Diễn viên">
            <TabActors actors={topActors} grid={3} />
          </WatchSection>

          <WatchSection title="Có thể bạn sẽ thích">
            {related.map((movie) => (
              //Bị lặp ui giống với search-item
              <Link key={movie.slug} href={`/phim/${movie.slug}`}>
                <MovieCard isHorizontal={true} movie={movie} />
              </Link>
            ))}
          </WatchSection>
        </div>
      </div>
    </div>
  )
}
