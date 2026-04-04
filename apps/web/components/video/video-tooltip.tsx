import { Tooltip } from "@vidstack/react"

interface VideoTooltipProps {
  children: React.ReactNode
  title: string
}
const VideoTooltip = ({ children, title }: VideoTooltipProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className="z-10 animate-out rounded-sm border border-gray-400/20 bg-black/90 px-2 py-0.5 text-sm font-medium text-white fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4"
        placement="top start"
      >
        {title}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export default VideoTooltip
