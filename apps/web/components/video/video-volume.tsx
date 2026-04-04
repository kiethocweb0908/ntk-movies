import { MuteButton, VolumeSlider } from "@vidstack/react"
import { MuteIcon, VolumeHighIcon, VolumeLowIcon } from "@vidstack/react/icons"

const VideoVolume = () => {
  return (
    <div className="group/volume flex items-center gap-2">
      <MuteButton className="group data-focus/volume:ring-4 relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md ring-sky-400 outline-none ring-inset hover:bg-white/20">
        <MuteIcon className="hidden h-8 w-8 group-data-[state='muted']:block" />
        <VolumeLowIcon className="hidden h-8 w-8 group-data-[state='low']:block" />
        <VolumeHighIcon className="hidden h-8 w-8 group-data-[state='high']:block" />
      </MuteButton>

      <VolumeSlider.Root className="relative mx-[7.5px] inline-flex h-10 w-15 cursor-pointer touch-none items-center outline-none select-none aria-hidden:hidden lg:w-30">
        <VolumeSlider.Track className="relative z-0 h-1.25 w-full rounded-sm bg-white/30 ring-sky-400 group-data-focus/volume:ring-[3px]">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-sm bg-indigo-400 will-change-[width]" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="absolute top-1/2 left-(--slider-fill) z-20 h-3.75 w-3.75 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity will-change-[left] group-data-dragging/volume:ring-4 group-data-active/volume:opacity-100" />
      </VolumeSlider.Root>
    </div>
  )
}

export default VideoVolume
