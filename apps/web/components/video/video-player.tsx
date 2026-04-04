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
import Image from "next/image"
import { IMG_URL } from "@workspace/ui/lib/config"

interface VideoPlayerProps {
  url: string
  title?: string
}

export default function VideoPlayer({ url, title = "" }: VideoPlayerProps) {
  const paused = useMediaState("paused")

  function onHlsInstance(hls: Hls) {
    hls.config.maxBufferLength = 5
    hls.config.enableWorker = true
  }

  return (
    <div className="group relative h-full w-full">
      <MediaPlayer
        src={url}
        viewType="video"
        crossOrigin
        playsInline
        streamType={url.includes("m3u8") ? "on-demand" : "unknown"}
        onHlsInstance={onHlsInstance}
        className="relative h-full w-full bg-slate-950"
      >
        <Title className="absolute w-fit p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {title}
        </Title>
        <MediaProvider />

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
              <div className="flex items-center gap-4 lg:gap-6">
                {/* play/pause */}
                <VideoTooltip title={paused ? "Phát" : "Dừng"}>
                  <PlayButton className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 data-focus:ring-4">
                    <PlayIcon className="hidden h-8 w-8 group-data-paused:block" />
                    <PauseIcon className="h-8 w-8 group-data-paused:hidden" />
                  </PlayButton>
                </VideoTooltip>

                {/* prev 10s */}
                <VideoTooltip title="Lùi 10 giây">
                  <SeekButton
                    className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 aria-hidden:hidden data-focus:ring-4"
                    seconds={-10}
                  >
                    <SeekBackward10Icon className="h-8 w-8" />
                  </SeekButton>
                </VideoTooltip>

                {/* next 10s */}
                <VideoTooltip title="Tới 10 giây">
                  <SeekButton
                    className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 aria-hidden:hidden data-focus:ring-4"
                    seconds={10}
                  >
                    <SeekForward10Icon className="h-8 w-8" />
                  </SeekButton>
                </VideoTooltip>

                {/* volume */}
                <VideoVolume />
              </div>

              <div className="flex items-center gap-4">
                <VideoTooltip title="Cửa sổ nổi">
                  <PIPButton className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 aria-hidden:hidden data-focus:ring-4">
                    <PictureInPictureIcon className="h-8 w-8 group-data-active:hidden" />
                    <PictureInPictureExitIcon className="hidden h-8 w-8 group-data-active:block" />
                  </PIPButton>
                </VideoTooltip>

                <VideoTooltip title="Phóng to">
                  <FullscreenButton className="group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20 aria-hidden:hidden data-focus:ring-4">
                    <FullscreenIcon className="h-8 w-8 group-data-active:hidden" />
                    <FullscreenExitIcon className="hidden h-8 w-8 group-data-active:block" />
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
