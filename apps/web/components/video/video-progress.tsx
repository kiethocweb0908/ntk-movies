import { TimeSlider } from "@vidstack/react"

const VideoProgress = () => {
  return (
    <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-5 w-full cursor-pointer touch-none items-center outline-none select-none aria-hidden:hidden md:h-10">
      <TimeSlider.Track className="relative z-0 h-1.25 w-full rounded-sm bg-white/30 ring-sky-400 group-data-focus:ring-[3px]">
        <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-sm bg-indigo-400 will-change-[width]" />
        <TimeSlider.Progress className="absolute z-10 h-full w-(--slider-progress) rounded-sm bg-white/50 will-change-[width]" />
      </TimeSlider.Track>
      <TimeSlider.Thumb className="absolute top-1/2 left-(--slider-fill) z-20 h-3.75 w-3.75 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity will-change-[left] group-data-dragging:ring-4 group-data-active:opacity-100" />

      <TimeSlider.Preview className="flex flex-col items-center opacity-0 transition-opacity data-visible:opacity-100">
        <TimeSlider.Value className="mb-2 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-white" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  )
}

export default VideoProgress
