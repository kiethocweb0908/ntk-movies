import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import {
  currentRoom,
  GetRoomsResponse,
  participant,
  Room,
  roomMessage,
} from "@workspace/shared/schema/room/room.response"

interface watchTogetherState {
  socket: Socket | null
  isConnected: boolean
  currentRoom: currentRoom | null
  participants: participant[]
  messages: roomMessage[]

  roomList: Room[]
  hasMore: boolean
  cursor: null | string

  connect: () => void
  disconnect: () => void
  joinRoom: (roomCode: string) => void
  emitEvent: (event: string, data: any) => void

  getSocketId: () => void
  setRoomList: (
    { rooms, hasMore, nextCursor }: GetRoomsResponse,
    isRefresh?: boolean
  ) => void
  setCurrentRoom: (room: currentRoom | null) => void
  setParticipants: (participants: participant[]) => void
  setMessages: (messages: roomMessage[]) => void
  clearState: () => void
}

export const useWatchTogetherStore = create<watchTogetherState>((set, get) => ({
  socket: null,
  isConnected: false,

  currentRoom: null,
  participants: [],
  messages: [],

  roomList: [],
  hasMore: false,
  cursor: null,

  connect: () => {
    if (get().socket?.connected) return

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/watch-together`, {
      withCredentials: true,
      transports: ["websocket"],
    })

    socket.on("connect", () => {})

    socket.on("authenticated", () => {
      set({ isConnected: true })
      console.log("Đã kết nối tới socket!")
    })

    socket.on("disconnect", (reason) => {
      if (!socket.connected) {
        set({ isConnected: false })
        console.log("Mất kết nối socket: ", reason)
      }
    })
    set({ socket })
  },

  disconnect: () => {
    const { socket, clearState } = get()
    if (socket) {
      socket.disconnect()
      clearState()
      set({ socket: null, isConnected: false }) // Chỉ xóa socket khi app unmount hẳn
      console.log("Ngắt kết nối socket!")
    }
  },

  joinRoom: (roomCode) => {
    const { socket } = get()
    if (socket) {
      socket.emit("join-room", { roomCode })

      socket.off("user-joined")
      socket.off("on-user-left")
      socket.off("on-message")
      // Không clear 'on-room-disbanded' ở đây, ta sẽ xử lý ở Component page.tsx

      socket.on("user-joined", (data: { user: participant }) => {
        const newUser = data.user
        set((state) => {
          if (state.participants.some((p) => p.id === newUser.id)) return state

          const name = newUser.firstName
            ? `${newUser.firstName} ${newUser.lastName || ""}`.trim()
            : newUser.email

          return {
            participants: [...state.participants, newUser],
            messages: [
              ...state.messages,
              {
                userId: "system",
                content: `${name} đã tham gia phòng`,
                type: "system",
              },
            ],
          }
        })
      })

      // Fix: Nhận thêm userName từ backend để hiển thị đúng tên khi rời
      socket.on(
        "on-user-left",
        (data: { userId: string; message: string; userName?: string }) => {
          set((state) => {
            const leavingUser = state.participants.find(
              (p) => p.id === data.userId
            )
            const name =
              data.userName ||
              (leavingUser
                ? leavingUser.firstName
                  ? `${leavingUser.firstName} ${leavingUser.lastName || ""}`.trim()
                  : leavingUser.email
                : "Một thành viên")

            return {
              participants: state.participants.filter(
                (p) => p.id !== data.userId
              ),
              messages: [
                ...state.messages,
                {
                  userId: "system",
                  content: `${name} đã rời phòng`,
                  type: "system",
                },
              ],
            }
          })
        }
      )

      socket.on("on-message", (data: roomMessage) => {
        set((state) => ({
          messages: [...state.messages, data],
        }))
      })
    }
  },

  emitEvent: (event, data) => {
    get().socket?.emit(event, data)
  },

  getSocketId: () => {
    return get().socket?.id || null
  },

  // Fix: Chống trùng lặp phòng khi fetch
  setRoomList: ({ rooms, hasMore, nextCursor }, isRefresh = false) => {
    set((state) => {
      if (isRefresh) {
        return { roomList: rooms, hasMore, cursor: nextCursor }
      }
      // Lọc bỏ phòng đã tồn tại
      const newRooms = rooms.filter(
        (r) => !state.roomList.some((sr) => sr.id === r.id)
      )
      return {
        roomList: [...state.roomList, ...newRooms],
        hasMore,
        cursor: nextCursor,
      }
    })
  },

  setCurrentRoom: (room) => set({ currentRoom: room }),
  setParticipants: (participants) => set({ participants }),
  setMessages: (messages) => set({ messages }),

  // Fix: Không set socket = null ở đây để giữ kết nối khi chuyển trang
  clearState: () => {
    set({
      currentRoom: null,
      messages: [],
      participants: [],
      // Tùy chọn: Để lại roomList để có cache khi quay ra, hoặc clear luôn
      roomList: [],
      hasMore: false,
      cursor: null,
    })
  },
}))
