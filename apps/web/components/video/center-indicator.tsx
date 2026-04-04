import { useEffect, useRef, useState } from "react"
import { useMediaState } from "@vidstack/react"
import { PlayIcon, PauseIcon, MuteIcon } from "@vidstack/react/icons"

type IndicatorType = "play" | "pause" | "seek" | "volume" | "waiting" | null

export default function CenterIndicator() {
  const paused = useMediaState("paused")
  const volume = useMediaState("volume")
  const muted = useMediaState("muted")
  const currentTime = useMediaState("currentTime")
  const waiting = useMediaState("waiting")

  const [type, setType] = useState<IndicatorType>(null)
  const [seekValue, setSeekValue] = useState(0)
  const [volumeValue, setVolumeValue] = useState(100)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevTimeRef = useRef(0)

  const show = (t: IndicatorType, autoHide = true) => {
    setType(t)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (!autoHide) return

    timeoutRef.current = setTimeout(() => {
      setType(null)
      setSeekValue(0)
    }, 800)
  }

  useEffect(() => {
    if (waiting) {
      show("waiting", false)
    } else {
      show(null)
    }
  }, [waiting])

  // ===== PLAY / PAUSE =====
  useEffect(() => {
    if (paused) {
      setType("play") // luôn hiện play khi pause
    } else {
      show("pause") // vừa bấm play → hiện pause icon
    }
  }, [paused])

  // ===== SEEK (CỘNG DỒN) =====
  useEffect(() => {
    const diff = currentTime - prevTimeRef.current

    if (Math.abs(diff) > 1.5) {
      setSeekValue((prev) => prev + Math.round(diff))
      show("seek")
    }

    prevTimeRef.current = currentTime
  }, [currentTime])

  // ===== VOLUME (HIỆN %) =====
  useEffect(() => {
    const v = muted ? 0 : Math.round(volume * 100)
    setVolumeValue(v)
    show("volume")
  }, [volume, muted])

  // ===== RENDER LOGIC =====
  const renderContent = () => {
    // PLAY ACTION
    if (type === "pause") {
      return <PauseIcon className="h-12 w-12 text-white" />
    }

    // SEEK
    if (type === "seek") {
      return (
        <span className="text-2xl font-semibold text-white">
          {seekValue > 0 ? `+${seekValue}s` : `${seekValue}s`}
        </span>
      )
    }

    // VOLUME
    if (type === "volume") {
      return (
        <span className="text-2xl font-semibold text-white">
          {volumeValue === 0 ? (
            <MuteIcon className="h-12 w-12 text-white" />
          ) : (
            volumeValue + "%"
          )}
        </span>
      )
    }

    if (waiting) {
      return (
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      )
    }

    // PAUSE → luôn hiện nút play
    if (paused) {
      return <PlayIcon className="h-12 w-12 text-white" />
    }

    return null
  }

  // Nếu đang play mà không có action → ẩn
  if (!paused && !type) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="rounded-full bg-black/60 px-6 py-4 backdrop-blur-md transition">
        {renderContent()}
      </div>
    </div>
  )
}
