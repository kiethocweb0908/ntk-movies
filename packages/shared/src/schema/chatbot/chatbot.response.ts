import { MovieResponse } from "../movie/movie.response.js"

export type ChatbotResponse =
  | {
      type: "text"
      message: string
    }
  | {
      type: "movie"
      message: string
      movies: MovieResponse[]
    }

export interface Messages {
  id: string
  isBot: boolean
  type: "movie" | "text"
  message: string
  movies?: MovieResponse[]
  // loading?: boolean
}
