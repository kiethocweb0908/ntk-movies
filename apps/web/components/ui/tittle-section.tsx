import { memo } from "react"

interface TittleSectionProps {
  title: string
}
const TitleSection = memo(({ title }: TittleSectionProps) => {
  console.log("TittleSection")
  return (
    <h3 className="mb-5 text-2xl leading-tight font-semibold text-primary md:text-3xl lg:text-2xl xl:text-3xl">
      {title}
    </h3>
  )
})

export default TitleSection
