import { MovieResponse } from "../movie/movie.response.js"

export interface FavoritesResponse {
  favorites: MovieResponse[]
  nextCursor: null | string
  hasMore: boolean
}
