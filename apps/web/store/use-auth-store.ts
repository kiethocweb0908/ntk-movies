import { UserResponse } from "@workspace/shared/schema/auth/auth.response"
import { create } from "zustand"

interface AuthState {
  user: UserResponse | null
  favIds: string[]
  favIdsSet: Set<string>
  isInitialized: boolean

  // Actions
  setAuth: (user: UserResponse, favIds: string[]) => void
  toggleFav: (movieId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  favIds: [],
  favIdsSet: new Set(),
  isInitialized: false,

  setAuth: (user, favIds) =>
    set({ user, favIds, favIdsSet: new Set(favIds), isInitialized: true }),

  toggleFav: (movieId) => {
    const exists = get().favIdsSet.has(movieId)

    const ids = exists
      ? get().favIds.filter((id) => id !== movieId)
      : [...get().favIds, movieId]

    set({ favIds: ids, favIdsSet: new Set(ids) })
  },

  logout: () =>
    set({ user: null, favIds: [], favIdsSet: new Set(), isInitialized: true }),
}))
