import { BaseType } from "../base.schema.js"

interface Base {
  id?: string
  name: string
  slug?: string
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

export interface MovieHome {
  message: string
  status: boolean
  data: {
    hero: MovieResponse[]
    korean: MovieResponse[]
    chienese: MovieResponse[]
    usuk: MovieResponse[]
    horror: MovieResponse[]
    chieurap: MovieResponse[]
    categories: BaseType[]
  }
}
