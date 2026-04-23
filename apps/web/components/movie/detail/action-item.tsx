"use client"

import { memo } from "react"

interface ActionItemProp {
  icon: any
  label: string | number
  onClick?: () => void
  className?: string
  isActive?: boolean
  classNameIcon?: string
}

const ActionItem = memo(
  ({
    icon: Icon,
    label,
    onClick,
    className,
    isActive,
    classNameIcon,
  }: ActionItemProp) => {
    return (
      <button
        onClick={onClick}
        className={`group flex cursor-pointer flex-col items-center gap-1.5 transition-all hover:text-textHover ${className}`}
      >
        <Icon
          fill={isActive ? "currentColor" : "none"}
          size={22}
          className={`transition-transform group-hover:scale-110 ${classNameIcon}`}
        />
        <span className="text-xs font-medium opacity-80">{label}</span>
      </button>
    )
  }
)

export default ActionItem
