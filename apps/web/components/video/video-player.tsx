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
  Title,
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
import CenterIndicator from "./center-indicator"
import MediaGesture from "./media-gesture"
import VideoProgress from "./video-progress"
import VideoTooltip from "./video-tooltip"
import VideoVolume from "./video-volume"
import { HistoryResponse } from "@workspace/shared/schema/history/history.response"
import { useEffect, useRef, useState } from "react"
import { useApi } from "@/hooks/use-api"
import { api } from "@/lib/api"

interface VideoPlayerProps {
  url: string
  title?: string
  movieSlug: string
  episodeId: string
  history: HistoryResponse | null
  isLoggedIn: boolean
}

export default function VideoPlayer({
  url,
  title = "",
  movieSlug,
  episodeId,
  history,
  isLoggedIn,
}: VideoPlayerProps) {
  const { callApi } = useApi()
  const player = useRef<MediaPlayerInstance>(null)
  const [hasViewIncreased, setHasViewIncreased] = useState(false)

  // const currentTime = useMediaState("currentTime", player)
  const duration = useMediaState("duration", player)
  const paused = useMediaState("paused", player)
  const canPlay = useMediaState("canPlay", player)
  //--------------------

  // tải đến đoạn đã xem
  useEffect(() => {
    if (!canPlay || !player.current) return

    let startTime = 0
    if (isLoggedIn && history) {
      startTime = history.currentTime
    } else {
      const localData = JSON.parse(
        localStorage.getItem("guest_history") || "{}"
      )
      startTime = localData[episodeId]?.currentTime || 0
    }

    if (startTime > 0 && player.current) {
      player.current.currentTime = startTime
    }
  }, [episodeId, canPlay])

  // Cập nhật lịch sử (Mỗi 30s và khi Pause)
  useEffect(() => {
    if (paused) return

    const syncHistory = async () => {
      if (!player.current) return
      const currentVideoTime = player.current.currentTime

      const payload = {
        episodeId,
        currentTime: Math.floor(currentVideoTime),
        duration: Math.floor(duration),
      }

      if (isLoggedIn) {
        await callApi("/history/update", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      } else {
        const localData = JSON.parse(
          localStorage.getItem("guest_history") || "{}"
        )
        localData[episodeId] = payload
        localStorage.setItem("guest_history", JSON.stringify(localData))
      }
    }
    const interval = setInterval(syncHistory, 30000)
    return () => clearInterval(interval)
  }, [paused, isLoggedIn, duration, episodeId])

  // Cập nhật lượt xem
  useEffect(() => {
    if (hasViewIncreased || paused || !canPlay) return

    const timer = setTimeout(async () => {
      try {
        await api(`/movies/update-view/${movieSlug}`, { method: "POST" })
        setHasViewIncreased(true)
      } catch (error) {
        console.error("Lỗi tăng lượt xem:", error)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [episodeId, movieSlug, hasViewIncreased, paused, canPlay])

  useEffect(() => {
    setHasViewIncreased(false)
  }, [episodeId])

  // gọi api tránh server ngủ đông
  // useEffect(() => {
  //   if (isLoggedIn) return

  //   const keepServerAlive = () => {
  //     api("/keep-server", { method: "GET" }).catch(() => {})
  //   }

  //   const heartbeatInterval = setInterval(keepServerAlive, 5 * 60 * 1000)
  //   return () => clearInterval(heartbeatInterval)
  // }, [isLoggedIn])

  function onHlsInstance(hls: Hls) {
    hls.config.maxBufferLength = 5
    hls.config.enableWorker = true
  }

  return (
    <div
      // className="group relative h-full w-full"
      className="group relative h-full w-full overflow-hidden bg-slate-950"
    >
      <MediaPlayer
        ref={player}
        src={url}
        title={title}
        viewType="video"
        crossOrigin
        playsInline
        streamType={url.includes("m3u8") ? "on-demand" : "unknown"}
        // streamType="on-demand"
        onHlsInstance={onHlsInstance}
        // className="relative h-full w-full overflow-hidden bg-black [&_video]:absolute [&_video]:inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      >
        {/* <Title className="pointer-events-none absolute top-0 left-0 z-20 hidden w-full bg-linear-to-b from-black/70 to-transparent p-4 text-base opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" /> */}
        <MediaProvider className="absolute inset-0 h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-contain" />

        <CenterIndicator />
        <MediaGesture />

        <Controls.Root className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/90 via-transparent p-4 opacity-0 transition-opacity duration-300 data-visible:opacity-100">
          <div className="pointer-events-auto relative flex w-full flex-col">
            {/* time */}
            <div className="absolute -top-5 right-0 left-0 flex justify-between px-4">
              <Time type="current" />
              <Time type="duration" />
            </div>
            {/* ===== THANH PROGRESS ===== */}
            <VideoProgress />

            {/* ===== HÀNG NÚT ĐIỀU KHIỂN ===== */}
            <div className="flex items-center justify-between text-white/90">
              <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                {/* play/pause */}
                <VideoTooltip title={paused ? "Phát" : "Dừng"}>
                  <PlayButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-2 md:h-10 md:w-10 md:data-focus:ring-4">
                    <PlayIcon className="hidden h-6 w-6 group-data-paused:block md:h-8 md:w-8" />
                    <PauseIcon className="h-6 w-6 group-data-paused:hidden md:h-8 md:w-8" />
                  </PlayButton>
                </VideoTooltip>

                {/* prev 10s */}
                <VideoTooltip title="Lùi 10 giây">
                  <SeekButton
                    className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-2 md:h-10 md:w-10 md:data-focus:ring-4"
                    seconds={-10}
                  >
                    <SeekBackward10Icon className="h-6 w-6 md:h-8 md:w-8" />
                  </SeekButton>
                </VideoTooltip>

                {/* next 10s */}
                <VideoTooltip title="Tới 10 giây">
                  <SeekButton
                    className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-2 md:h-10 md:w-10 md:data-focus:ring-4"
                    seconds={10}
                  >
                    <SeekForward10Icon className="h-6 w-6 md:h-8 md:w-8" />
                  </SeekButton>
                </VideoTooltip>

                {/* volume */}
                <VideoVolume />
              </div>

              <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                <VideoTooltip title="Cửa sổ nổi">
                  <PIPButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-2 md:h-10 md:w-10 md:data-focus:ring-4">
                    <PictureInPictureIcon className="h-6 w-6 group-data-active:hidden md:h-8 md:w-8" />
                    <PictureInPictureExitIcon className="hidden h-6 w-6 group-data-active:block md:h-8 md:w-8" />
                  </PIPButton>
                </VideoTooltip>

                <VideoTooltip title="Phóng to">
                  <FullscreenButton className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-2 md:h-10 md:w-10 md:data-focus:ring-4">
                    <FullscreenIcon className="h-6 w-6 group-data-active:hidden md:h-8 md:w-8" />
                    <FullscreenExitIcon className="hidden h-6 w-6 group-data-active:block md:h-8 md:w-8" />
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
