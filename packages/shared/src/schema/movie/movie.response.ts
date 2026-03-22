import { BaseType } from "../base.schema.js"

interface Base {
  id?: string
  name: string
  slug?: string
}

export interface AppResponse<T> {
  message: string
  status: boolean
  data: T
}

export interface MovieResponse {
  id: string
  name: string
  originName: string | null
  slug: string
  thumbUrl: string | null
  posterUrl: string | null
  content: string | null
  type: string
  year: Number | null
  time: string | null
  lang: string | null
  lang_key: string[]
  quality: string | null
  status: string
  tmdbType: string | null
  tmdbSeason: Number | null
  tmdb_vote_average: Number | null
  tmdb_vote_count: Number | null
  imdb_vote_average: Number | null
  imdb_vote_count: Number | null
  categories: Base[]
  countries: Base[]
}

export interface MovieResponseFull extends MovieResponse {
  externalId: string | null
  alternativeNames: string[]
  sub_docquyen: boolean
  chieurap: boolean
  lastEpisodes: any
  content: string | null
  is_copyrigh: boolean
  trailerUrl: string | null
  episodeTotal: string | null
  viewCount: number
  notify: string | null
  showtimes: string | null
  seriesSlug: string | null
  published: boolean
  tmdbId: string | null
  tmdbSeason: number | null
  tmdb_vote_count: number
  imdbId: string | null
  imdb_vote_count: number
  createdAt: string | Date
  updatedAt: string | Date
}

export interface MovieHomeData {
  hero: MovieResponse[]
  korean: MovieResponse[]
  chienese: MovieResponse[]
  usuk: MovieResponse[]
  horror: MovieResponse[]
  topViewHorror: MovieResponse[]
  chieurap: MovieResponse[]
  topViewChieurap: MovieResponse[]
  categories: BaseType[]
}

export interface MovieMood {
  message: string
  status: boolean
  data: MovieResponse[]
}

export interface EpisodeResponse {
  name: string
  slug: string
  linkEmbed?: string | null
}

export interface ServerResponse {
  id: string
  name: string
  episodes: EpisodeResponse[]
}

export interface ActorResponse {
  id: string
  tmdb_people_id: number | null
  gender: number
  name: string
  originalName: string | null
  profile_path: string | null
  character: string | null
  role: string
}

export interface MovieDetailResponse {
  movie: MovieResponseFull
  actors: ActorResponse[]
  servers: ServerResponse[]
  related: MovieResponse[]
}
