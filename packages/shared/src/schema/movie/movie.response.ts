interface Base {
  id?: string
  name: string
  slug?: string
}

export interface MovieResponse {
  id: string
  name: string
  slug: string
  thumbUrl: string
  posterUrl: string
  content: string
  type: string
  year: Number
  time: string
  lang_Key: string[]
  quantity: string
  status: string
  tmdbType: string
  tmdbSeason: Number
  tmdb_vote_average: Number
  tmdb_vote_count: Number
  imdb_vote_average: Number
  imdb_vote_count: Number
  categories: Base[]
  countries: Base[]
}
