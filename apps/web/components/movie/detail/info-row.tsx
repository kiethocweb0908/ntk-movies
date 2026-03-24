interface InfoRowProps {
  label: string
  children: React.ReactNode
}

const InfoRow = ({ label, children }: InfoRowProps) => {
  return (
    <div className="mb-3 flex w-full items-start justify-start gap-2">
      <span className="font-semibold whitespace-nowrap text-primary">
        {label}:{" "}
      </span>
      <div className="flex translate-y-0.75 flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default InfoRow
