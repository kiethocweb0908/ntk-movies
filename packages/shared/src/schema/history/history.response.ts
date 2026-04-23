import { MovieResponse } from "../movie/movie.response.js"

export interface HistoryResponse {
  currentTime: number
  duration: number
  isCompleted: boolean
  updatedAt?: Date
  progress?: number
}

export interface MovieHistory {
  history: HistoryResponse
  episode: {
    name: string
    slug: string
    serverId: string
    serverName: string
  }
  movie: {
    id: string
    slug: string
    name: string
    originName: string | null
    thumbUrl: string | null
    posterUrl: string | null
  }
}

export interface HistoriesResponse {
  histories: MovieHistory[]
  nextCursor: null | string
  hasMore: boolean
}
