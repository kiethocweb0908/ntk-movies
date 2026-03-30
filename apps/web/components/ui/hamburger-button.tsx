"use client"

import { cn } from "@workspace/ui/lib/utils"

interface HamburgerButtonProps {
  isOpen: boolean
}

const HamburgerButton = ({ isOpen }: HamburgerButtonProps) => {
  return (
    <div className="relative flex h-6 w-6 flex-col items-center justify-center gap-1.5">
      {/* Thanh trên cùng */}
      <span
        className={cn(
          "h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out",
          isOpen && "absolute translate-y-0 rotate-45 bg-[#ff6b6b]"
        )}
      />

      {/* Thanh giữa - Căn lề phải (self-end) */}
      <span
        className={cn(
          "h-0.5 w-5 self-end rounded-full bg-white transition-all duration-300 ease-in-out",
          isOpen && "opacity-0"
        )}
      />

      {/* Thanh dưới cùng */}
      <span
        className={cn(
          "h-0.5 w-full rounded-full bg-white transition-all duration-300 ease-in-out",
          isOpen && "absolute translate-y-0 -rotate-45 bg-[#ff6b6b]" // Màu đỏ cam khi mở
        )}
      />
    </div>
  )
}

export default HamburgerButton
