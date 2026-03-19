"use client"

const HeroProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="absolute top-0 left-0 z-50 h-1 w-full bg-white/10">
      <div
        className="h-full bg-red-600 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default HeroProgress
