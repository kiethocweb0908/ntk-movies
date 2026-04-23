import { Gesture } from "@vidstack/react"

const MediaGesture = () => {
  return (
    <>
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full lg:pointer-coarse:hidden"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full lg:pointer-fine:hidden"
        event="pointerup"
        action="toggle:controls"
      />

      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className="absolute inset-0 z-10 block h-full w-1/4"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute top-0 right-0 z-10 h-full w-1/4"
        event="dblpointerup"
        action="seek:10"
      />
    </>
  )
}

export default MediaGesture
