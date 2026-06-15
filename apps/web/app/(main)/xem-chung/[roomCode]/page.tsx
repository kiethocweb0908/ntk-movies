"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"
import WatchTogetherPlayer from "@/components/watch-together/watch-together-player"
import RoomChatPanel from "@/components/watch-together/room-chat-panel"
import MovieWatchInfo from "@/components/movie/watch/movie-watch-info"
import WatchSection from "@/components/movie/watch/watch-section"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Button } from "@workspace/ui/components/button"
import { Database, LoaderIcon, Lock } from "lucide-react"
import { MovieServerResponse } from "@workspace/shared/schema/movie/movie.response"
import { cn } from "@workspace/ui/lib/utils"

function safeJoinRoom(
  socket: ReturnType<typeof useWatchTogetherStore.getState>["socket"],
  joinRoomStore: (code: string) => void,
  roomCode: string
) {
  if (!socket) return
  if (socket.connected) {
    joinRoomStore(roomCode)
  } else {
    socket.once("authenticated", () => joinRoomStore(roomCode))
  }
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const { callApi } = useApi()

  const currentRoom = useWatchTogetherStore((s) => s.currentRoom)
  const setCurrentRoom = useWatchTogetherStore((s) => s.setCurrentRoom)
  const setParticipants = useWatchTogetherStore((s) => s.setParticipants)
  const setMessages = useWatchTogetherStore((s) => s.setMessages)
  const joinRoomStore = useWatchTogetherStore((s) => s.joinRoom)
  const socket = useWatchTogetherStore((s) => s.socket)
  const isConnected = useWatchTogetherStore((s) => s.isConnected)
  const clearState = useWatchTogetherStore((s) => s.clearState)

  const roomCode = params.roomCode as string

  const [loading, setLoading] = useState(true)
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const isDisbandedRef = useRef(false)
  const hasJoinedRef = useRef(false)

  const doJoinRoom = () => {
    if (hasJoinedRef.current) return
    hasJoinedRef.current = true
    safeJoinRoom(socket, joinRoomStore, roomCode)
  }

  // BỎ LƯỢC ĐOẠN IF (currentRoom === roomCode) RETURN. Luôn luôn check lại db khi vào trang!
  useEffect(() => {
    hasJoinedRef.current = false
    isDisbandedRef.current = false
    setLoading(true)

    const checkRoom = async () => {
      try {
        const res = await callApi<any>(
          `/watch-together/check-room/${roomCode}`,
          { method: "GET" }
        )

        if (res.data) {
          if (res.data.requirePassword) {
            setRequirePassword(true)
            setCurrentRoom(res.data.room)
          } else {
            setCurrentRoom(res.data.room)
            setParticipants(res.data.room.participants || [])
            doJoinRoom()
          }
        }
      } catch (err: any) {
        if (!isDisbandedRef.current) {
          toast.error(err.message || "Không thể truy cập phòng này!")
          router.push("/xem-chung")
        }
      } finally {
        setLoading(false)
      }
    }

    checkRoom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode])

  useEffect(() => {
    if (
      isConnected &&
      !loading &&
      !requirePassword &&
      currentRoom?.roomCode === roomCode &&
      !hasJoinedRef.current
    ) {
      doJoinRoom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  // Lắng nghe Giải tán phòng
  useEffect(() => {
    if (!socket) return

    const handleDisbanded = () => {
      const state = useWatchTogetherStore.getState()
      if (isDisbandedRef.current || state.currentRoom?.isHost) return // Chủ phòng đã toast lúc bấm API
      isDisbandedRef.current = true
      toast.error("Chủ phòng đã giải tán phòng!")
      clearState()
      router.push("/xem-chung")
    }

    socket.on("on-room-disbanded", handleDisbanded)
    return () => {
      socket.off("on-room-disbanded", handleDisbanded)
    }
  }, [socket, router, clearState])

  // Lắng nghe Đổi tập (Dành cho thành viên)
  useEffect(() => {
    if (!socket) return

    const handleEpisodeChanged = (data: {
      episodeId: string
      episode: any
    }) => {
      const state = useWatchTogetherStore.getState()
      if (!state.currentRoom) return
      if (state.currentRoom.isHost) return // Chủ phòng đã cập nhật tức thì ở hàm handleChangeEpisode rồi

      setCurrentRoom({
        ...state.currentRoom,
        episodeId: data.episodeId,
        episode: data.episode,
        currentTime: 0,
        isPlaying: false,
      })
      toast.info(`Chủ phòng đã đổi sang tập: ${data.episode?.name || ""}`)
    }

    socket.on("on-change-episode", handleEpisodeChanged)
    return () => {
      socket.off("on-change-episode", handleEpisodeChanged)
    }
  }, [socket])

  // --- Nộp mật khẩu ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length !== 6) {
      setErrorMsg("Mật khẩu gồm 6 ký tự")
      return
    }

    setIsSubmittingPassword(true)
    setErrorMsg("")
    try {
      const res = await callApi<any>("/watch-together/join-room", {
        method: "POST",
        body: JSON.stringify({ roomCode, password }),
      })

      if (res.data) {
        setCurrentRoom(res.data.room)
        setParticipants(res.data.room.participants || [])
        setRequirePassword(false)
        hasJoinedRef.current = false
        doJoinRoom()
        toast.success("Vào phòng thành công!")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Mật khẩu không chính xác!")
      setPassword("")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // --- Đổi tập phim (Chủ phòng) ---
  const handleChangeEpisode = async (episodeId: string) => {
    if (!currentRoom || !currentRoom.isHost) return
    try {
      const res = await callApi<any>("/watch-together/change-episode", {
        method: "POST",
        body: JSON.stringify({ roomCode, episodeId }),
      })

      // FIX: Cập nhật state NGAY LẬP TỨC cho chủ phòng
      if (res.data) {
        setCurrentRoom({
          ...currentRoom,
          episodeId: res.data.episodeId,
          episode: res.data.episode,
          currentTime: 0,
          isPlaying: false,
        })
      }
      toast.success("Đã đổi tập phim!")
    } catch (err: any) {
      toast.error(err.message || "Không thể đổi tập phim lúc này!")
    }
  }

  // --- Render ---
  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center gap-2 text-white">
        <LoaderIcon size={24} className="animate-spin text-primary" />
        Đang tải thông tin phòng...
      </div>
    )
  }

  if (requirePassword) {
    /* (Render UI Password như cũ) */
    return (
      <div className="mx-auto mt-20 w-full max-w-md rounded-2xl border border-white/5 bg-slate-900 p-6 text-white md:p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-red-500/15 p-4 text-red-500">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold">Phòng riêng tư</h1>
          <p className="text-sm text-slate-400">
            Mật khẩu yêu cầu để vào phòng:{" "}
            <span className="font-semibold text-white">
              {currentRoom?.name || roomCode}
            </span>
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <InputOTP
              maxLength={6}
              value={password}
              onChange={(val) => setPassword(val)}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-12 rounded-lg border-white/10 text-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {errorMsg && (
              <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="filter"
            disabled={isSubmittingPassword || password.length !== 6}
            className="w-full! cursor-pointer py-6! text-base font-semibold"
          >
            {isSubmittingPassword ? "Đang xử lý..." : "Xác nhận vào phòng"}
          </Button>
        </form>
      </div>
    )
  }

  const movie = currentRoom?.movie
  const servers = currentRoom?.servers as MovieServerResponse[]
  const currentEpisode = currentRoom?.episode
  const streamUrl = currentEpisode?.linkM3u8 || currentEpisode?.linkEmbed || ""

  return (
    <div className="mx-auto min-h-screen pt-24 pb-10 text-white">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái */}
        <div className="space-y-6 lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
            {streamUrl ? (
              <WatchTogetherPlayer
                url={streamUrl}
                title={currentEpisode ? "Tập " + currentEpisode.name : ""}
                roomCode={roomCode}
                isHost={!!currentRoom?.isHost}
                initialTime={currentRoom?.currentTime ?? 0}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                Chưa có link tập phim
              </div>
            )}
          </div>

          {movie && <MovieWatchInfo movie={movie as any} />}

          {currentRoom?.isHost && servers && servers.length > 0 && (
            <WatchSection
              titlePosition="outside"
              title="Danh sách tập phim (Chủ phòng điều khiển)"
            >
              <div className="flex flex-col gap-8">
                {servers.map((server) => (
                  <div key={server.id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-l-4 border-yellow-400 pl-3">
                      <Database
                        size={18}
                        className="text-yellow-400 opacity-80"
                      />
                      <h3 className="text-sm font-bold tracking-widest text-white uppercase">
                        {server.name}
                      </h3>
                      <span className="ml-2 rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
                        {server.episodes.length} tập
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                      {server.episodes.map((ep) => {
                        const isActive = currentEpisode?.id === ep.id
                        return (
                          <button
                            key={ep.slug}
                            onClick={() => handleChangeEpisode(ep.id)}
                            className={cn(
                              "flex h-9 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold tracking-wider uppercase transition-all duration-300 select-none",
                              isActive
                                ? "scale-105 border-primary bg-primary font-bold text-slate-950 shadow-lg shadow-primary/20"
                                : "border-white/5 bg-slate-800/40 text-slate-300 hover:bg-slate-700/60 hover:text-white"
                            )}
                          >
                            {ep.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </WatchSection>
          )}
        </div>

        {/* Cột phải: Chat */}
        <div className="h-[600px] min-h-[500px] lg:h-[calc(100vh-12rem)]">
          {currentRoom && (
            <RoomChatPanel
              roomCode={roomCode}
              roomId={currentRoom.id}
              isHost={!!currentRoom.isHost}
            />
          )}
        </div>
      </div>
    </div>
  )
}
