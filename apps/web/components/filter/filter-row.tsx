interface FilterRowProps {
  label: string
  children: React.ReactNode
}

const FilterRow = ({ label, children }: FilterRowProps) => {
  return (
    <div className="flex w-full items-start gap-6">
      <div className="min-w-20 pt-1 lg:min-w-25">
        <span className="text-sm font-medium whitespace-nowrap text-primary">
          {label}:
        </span>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {children}
      </div>
    </div>
  )
}

export default FilterRow
