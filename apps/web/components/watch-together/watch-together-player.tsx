"use client"

import {
  MediaPlayer,
  MediaProvider,
  PlayButton,
  SeekButton,
  Time,
  Controls,
  FullscreenButton,
  PIPButton,
  useMediaState,
  MediaPlayerInstance,
} from "@vidstack/react"
import {
  FullscreenIcon,
  FullscreenExitIcon,
  PlayIcon,
  PauseIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
  PictureInPictureIcon,
  PictureInPictureExitIcon,
} from "@vidstack/react/icons"
import Hls from "hls.js"
import CenterIndicator from "../video/center-indicator"
import MediaGesture from "../video/media-gesture"
import VideoProgress from "../video/video-progress"
import VideoTooltip from "../video/video-tooltip"
import VideoVolume from "../video/video-volume"
import { useEffect, useRef } from "react"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { cn } from "@workspace/ui/lib/utils"

interface WatchTogetherPlayerProps {
  url: string
  title?: string
  roomCode: string
  isHost: boolean
  initialTime?: number
}

export default function WatchTogetherPlayer({
  url,
  title = "",
  roomCode,
  isHost,
  initialTime = 0,
}: WatchTogetherPlayerProps) {
  const player = useRef<MediaPlayerInstance>(null)
  const socket = useWatchTogetherStore((s) => s.socket)
  const emitEvent = useWatchTogetherStore((s) => s.emitEvent)

  const paused = useMediaState("paused", player)
  const canPlay = useMediaState("canPlay", player)

  // Lưu và Phục hồi thời gian qua LocalStorage cho Host (Khắc phục f5 mất time)
  useEffect(() => {
    if (!isHost || !canPlay || !player.current) return
    const savedTime = localStorage.getItem(`room_time_${roomCode}`)
    if (savedTime && initialTime === 0) {
      player.current.currentTime = parseFloat(savedTime)
    }

    const interval = setInterval(() => {
      if (player.current) {
        localStorage.setItem(
          `room_time_${roomCode}`,
          player.current.currentTime.toString()
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isHost, canPlay, roomCode, initialTime])

  // ===============================
  // ĐỒNG BỘ DÀNH CHO KHÁCH (GUEST)
  // ===============================
  useEffect(() => {
    if (isHost || !socket) return

    const handleSync = (data: {
      action: "play" | "pause" | "seek"
      currentTime: number
    }) => {
      if (!player.current) return
      const diff = Math.abs(player.current.currentTime - data.currentTime)

      if (data.action === "play") {
        if (player.current.paused) player.current.play().catch(() => {})
      } else if (data.action === "pause") {
        if (!player.current.paused) player.current.pause()
      } else if (data.action === "seek" || diff > 2) {
        player.current.currentTime = data.currentTime
      }
    }

    socket.on("on-sync-video", handleSync)
    return () => {
      socket.off("on-sync-video", handleSync)
    }
  }, [socket, isHost])

  // ===============================
  // ĐỒNG BỘ DÀNH CHO CHỦ PHÒNG (HOST)
  // ===============================
  // Gửi trạng thái video ngay lập tức cho người MỚI VÀO PHÒNG
  useEffect(() => {
    if (!isHost || !socket) return

    const handleRequestState = (data: { targetSocketId: string }) => {
      if (!player.current) return
      emitEvent("send-video-state", {
        targetSocketId: data.targetSocketId,
        currentTime: player.current.currentTime,
        isPlaying: !player.current.paused,
      })
    }

    socket.on("request-video-state", handleRequestState)
    return () => {
      socket.off("request-video-state", handleRequestState)
    }
  }, [socket, isHost, emitEvent])

  const handlePlay = () => {
    if (!isHost || !player.current) return
    emitEvent("sync-video", {
      roomCode,
      action: "play",
      currentTime: player.current.currentTime,
    })
  }

  const handlePause = () => {
    if (!isHost || !player.current) return
    emitEvent("sync-video", {
      roomCode,
      action: "pause",
      currentTime: player.current.currentTime,
    })
  }

  const handleSeeked = () => {
    if (!isHost || !player.current) return
    emitEvent("sync-video", {
      roomCode,
      action: "seek",
      currentTime: player.current.currentTime,
    })
  }

  const handleCanPlay = () => {
    if (player.current && initialTime > 0 && !isHost) {
      if (Math.abs(player.current.currentTime - initialTime) > 2) {
        player.current.currentTime = initialTime
      }
    }
  }

  function onHlsInstance(hls: Hls) {
    hls.config.maxBufferLength = 5
    hls.config.enableWorker = true
  }

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg bg-slate-950 md:rounded-xl">
      {/* TẤM CHẮN KHÓA HOÀN TOÀN TƯƠNG TÁC CHO GUEST */}
      {!isHost && (
        <div
          className="absolute inset-0 z-[60] cursor-not-allowed"
          title="Chỉ chủ phòng mới có thể điều khiển video"
        />
      )}

      <MediaPlayer
        ref={player}
        src={url}
        title={title}
        viewType="video"
        crossOrigin
        playsInline
        keyDisabled={!isHost} // Chặn phím cứng (Space, Arrow keys) từ Vidstack
        streamType={url.includes("m3u8") ? "on-demand" : "unknown"}
        onHlsInstance={onHlsInstance}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onCanPlay={handleCanPlay}
      >
        <MediaProvider className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-contain" />

        <CenterIndicator />
        {isHost && <MediaGesture />}

        <Controls.Root className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent p-4 opacity-0 transition-opacity duration-300 data-[visible]:opacity-100">
          <div className="pointer-events-auto relative flex w-full flex-col">
            <div className="absolute -top-5 right-0 left-0 flex justify-between px-4 text-xs text-slate-300">
              <Time type="current" />
              <Time type="duration" />
            </div>

            <div className={cn("w-full", !isHost && "pointer-events-none")}>
              <VideoProgress />
            </div>

            <div className="mt-2 flex items-center justify-between text-white/90">
              <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                <div
                  className={cn(!isHost && "pointer-events-none opacity-50")}
                >
                  <VideoTooltip title={paused ? "Phát" : "Dừng"}>
                    <PlayButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-[focus]:ring-2 md:h-10 md:w-10 md:data-[focus]:ring-4">
                      <PlayIcon className="hidden h-6 w-6 group-data-[paused]:block md:h-8 md:w-8" />
                      <PauseIcon className="h-6 w-6 group-data-[paused]:hidden md:h-8 md:w-8" />
                    </PlayButton>
                  </VideoTooltip>
                </div>

                <div
                  className={cn(!isHost && "pointer-events-none opacity-50")}
                >
                  <VideoTooltip title="Lùi 10 giây">
                    <SeekButton
                      className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-[focus]:ring-2 md:h-10 md:w-10 md:data-[focus]:ring-4"
                      seconds={-10}
                    >
                      <SeekBackward10Icon className="h-6 w-6 md:h-8 md:w-8" />
                    </SeekButton>
                  </VideoTooltip>
                </div>

                <div
                  className={cn(!isHost && "pointer-events-none opacity-50")}
                >
                  <VideoTooltip title="Tới 10 giây">
                    <SeekButton
                      className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-[focus]:ring-2 md:h-10 md:w-10 md:data-[focus]:ring-4"
                      seconds={10}
                    >
                      <SeekForward10Icon className="h-6 w-6 md:h-8 md:w-8" />
                    </SeekButton>
                  </VideoTooltip>
                </div>

                <VideoVolume />
              </div>

              <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                {/* Các nút PIP/Fullscreen như cũ */}
                <VideoTooltip title="Cửa sổ nổi">
                  <PIPButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-[focus]:ring-2 md:h-10 md:w-10 md:data-[focus]:ring-4">
                    <PictureInPictureIcon className="h-6 w-6 group-data-[active]:hidden md:h-8 md:w-8" />
                    <PictureInPictureExitIcon className="hidden h-6 w-6 group-data-[active]:block md:h-8 md:w-8" />
                  </PIPButton>
                </VideoTooltip>

                <VideoTooltip title="Phóng to">
                  <FullscreenButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-[focus]:ring-2 md:h-10 md:w-10 md:data-[focus]:ring-4">
                    <FullscreenIcon className="h-6 w-6 group-data-[active]:hidden md:h-8 md:w-8" />
                    <FullscreenExitIcon className="hidden h-6 w-6 group-data-[active]:block md:h-8 md:w-8" />
                  </FullscreenButton>
                </VideoTooltip>
              </div>
            </div>
          </div>
        </Controls.Root>
      </MediaPlayer>
    </div>
  )
}
