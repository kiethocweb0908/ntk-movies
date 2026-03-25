import {
  ActorResponse,
  MovieResponse,
  MovieServerResponse,
} from "@workspace/shared/schema/movie/movie.response"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import TabTrailer from "./tabs/tab-trailer"
import TabEpisodes from "./tabs/tab-episodes"
import TabActors from "./tabs/tab-actors"
import TabRelated from "./tabs/tab-related"

interface MovieTabsProps {
  trailerUrl: string
  servers: MovieServerResponse[]
  actors: ActorResponse[]
  related: MovieResponse[]
}

const tabClass =
  "relative h-12 px-4 text-sm font-medium text-slate-400 transition-all " +
  "hover:text-white " +
  "data-[state=active]:text-yellow-400 " +
  "after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all " +
  "data-[state=active]:after:w-full"

const MovieTabs = ({
  trailerUrl,
  servers,
  actors,
  related,
}: MovieTabsProps) => {
  return (
    <Tabs defaultValue="trailer" className="w-full px-5 py-6 lg:px-8 lg:py-4">
      {/* Tabs menu */}
      <TabsList
        variant={"line"}
        className="w-full justify-between gap-1 border-b border-slate-800 bg-transparent p-0 pb-3 sm:gap-8 md:justify-start"
      >
        <TabsTrigger value="trailer" className={tabClass}>
          Trailer
        </TabsTrigger>

        <TabsTrigger value="episodes" className={tabClass}>
          Tập phim
        </TabsTrigger>

        <TabsTrigger value="actors" className={tabClass}>
          Diễn viên
        </TabsTrigger>

        <TabsTrigger value="related" className={tabClass}>
          Đề xuất
        </TabsTrigger>
      </TabsList>

      {/* Content */}
      <div className="mt-6 min-h-100">
        <TabsContent value="trailer">
          <TabTrailer trailerUrl={trailerUrl} />
        </TabsContent>

        <TabsContent value="episodes">
          <TabEpisodes servers={servers} />
        </TabsContent>

        <TabsContent value="actors">
          <TabActors actors={actors} />
        </TabsContent>

        <TabsContent value="related">
          <TabRelated related={related} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default MovieTabs
