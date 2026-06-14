
interface WatchSectionProps {
  children: React.ReactNode
  titlePosition?: "inside" | "outside"
  title: string
}

const WatchSection = ({
  children,
  title,
  titlePosition = "inside",
}: WatchSectionProps) => {
  return (
    <>
      {titlePosition === "outside" && (
        <h3 className="mb-4 text-2xl font-semibold text-white">{title}</h3>
      )}
      <div className="rounded-lg bg-slate-900/50 p-4">
        {titlePosition === "inside" && (
          <h3 className="mb-4 text-xl font-semibold text-primary">{title}</h3>
        )}
        {children}
        {/* <TabEpisodes movieSlug={slug} servers={servers} /> */}
      </div>
    </>
  )
}

export default WatchSection
