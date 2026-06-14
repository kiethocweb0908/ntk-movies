import { MovieResponseFull, MovieServerResponse } from "../movie/movie.response.js"

export interface currentRoom {
  id: string
  roomCode: string
  name: string | null

  movieId: string
  episodeId: string | null
  isPrivate: boolean

  isPlaying: boolean
  currentTime: number
  isActive: boolean

  isHost?: boolean
  movie?: MovieResponseFull
  servers?: MovieServerResponse[]
  episode?: {
    id: string
    name: string | null
    linkEmbed: string | null
    linkM3u8: string | null
    slug: string
  } | null
}
export interface participant {
  id: string
  email: string
  avatarUrl: string | null
  firstName: string | null
  lastName: string | null
}

export interface RoomResponse extends currentRoom {
  participants: participant[]
}

export interface roomMessage {
  type: "user" | "system"
  userId?: string
  content: string
  userName?: string
  userEmail?: string
}

export interface Room {
  id: string
  name: string | null
  isPrivate: boolean
  updatedAt: Date
  roomCode: string
  movie: {
    id: string
    slug: string
    name: string
    originName: string | null
    posterUrl: string | null
    thumbUrl: string | null
  }
}

export interface GetRoomsResponse {
  rooms: Room[]
  nextCursor: null | string
  hasMore: boolean
}

export interface EpisodeDetail {
  id: string;
  name: string;
  linkEmbed: string | null;
  linkM3u8: string | null;
  slug: string;
}