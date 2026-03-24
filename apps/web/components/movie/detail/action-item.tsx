interface ActionItemProp {
  icon: any
  label: string | number
  onClick?: () => void
  className?: string
}

const ActionItem = ({
  icon: Icon,
  label,
  onClick,
  className,
}: ActionItemProp) => {
  return (
    <button
      onClick={onClick}
      className={`group flex cursor-pointer flex-col items-center gap-1.5 transition-all hover:text-textHover ${className}`}
    >
      <Icon size={22} className="transition-transform group-hover:scale-110" />
      <span className="text-xs font-medium opacity-80">{label}</span>
    </button>
  )
}

export default ActionItem
