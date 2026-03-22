import { memo } from "react"

interface TittleSectionProps {
  tittle: string
}
const TitleSection = memo(({ tittle }: TittleSectionProps) => {
  console.log("TittleSection")
  return (
    <h3 className="mb-5 text-2xl leading-tight font-semibold text-primary md:text-3xl lg:text-2xl xl:text-3xl">
      {tittle}
    </h3>
  )
})

export default TitleSection
