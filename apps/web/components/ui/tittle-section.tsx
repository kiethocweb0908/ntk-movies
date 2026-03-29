import { cn } from "@workspace/ui/lib/utils"
import { memo } from "react"

interface TittleSectionProps {
  title: string
  className?: string
}
const TitleSection = memo(({ title, className = "" }: TittleSectionProps) => {
  return (
    <h3
      className={cn(
        "mb-5 text-2xl leading-tight font-semibold text-primary md:text-3xl lg:text-2xl xl:text-3xl",
        className
      )}
    >
      {title}
    </h3>
  )
})

export default TitleSection
