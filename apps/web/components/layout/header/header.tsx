"use client"

import React, { useEffect, useState } from "react"
import { Logo } from "./logo"
import { SearchBar } from "./search-bar"
import UserActions from "./user-actions"
import { cn } from "@workspace/ui/lib/utils"

interface HeaderProps {
  mainNav: React.ReactNode
}

const Header = ({ mainNav }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      // Nếu cuộn quá 20px thì đổi trạng thái
      if (window.scrollY > 60) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed right-0 left-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ease-in-out lg:px-5",
        isScrolled
          ? "h-18 bg-slate-900/90 shadow-lg backdrop-blur-md"
          : "h-22 bg-transparent"
      )}
    >
      <div className="flex flex-1 gap-6">
        <Logo />

        <SearchBar />

        {mainNav}
      </div>

      <UserActions />
    </div>
  )
}

export default Header
