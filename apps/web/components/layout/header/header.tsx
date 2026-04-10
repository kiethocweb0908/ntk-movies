"use client"

import React, { useEffect, useState } from "react"
import { Logo } from "./logo"
import { cn } from "@workspace/ui/lib/utils"
import SearchBar from "@/components/search/search-bar"
import SearchMobile from "@/components/search/search-mobile"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import { MainNav } from "./main-nav"
import MobileNav from "./mobile-nav"
import UserActions from "./user-actions"

interface HeaderProps {
  categories: CategoryResponse[]
  countries: CountryResponse[]
  user?: any
}

const Header = ({ categories, countries, user }: HeaderProps) => {
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
      <div className="flex flex-1 items-center gap-6">
        <Logo />

        <SearchBar />

        <MainNav categories={categories} countries={countries} />
      </div>

      {/* right */}
      <div className="flex items-center justify-end gap-6">
        <SearchMobile />
        <div className="hidden md:block">
          <UserActions user={user} />
        </div>
        <MobileNav categories={categories} countries={countries} />
      </div>
    </div>
  )
}

export default Header
