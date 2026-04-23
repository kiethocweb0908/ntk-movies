"use client"

import HamburgerButton from "@/components/ui/hamburger-button"
import { MOVIE_TYPES } from "@/lib/constants"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { useState } from "react"
import MobileNavItem from "./mobile-nav-item"
import { Accordion } from "@workspace/ui/components/accordion"
import { UserResponse } from "@workspace/shared/schema/auth/auth.response"
import UserActions from "./user-actions"

interface MobileNavProps {
  categories: CategoryResponse[]
  countries: CountryResponse[]
  user: UserResponse | null
}

const MobileNav = ({ categories, countries, user }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      <DrawerTrigger className="flex items-center justify-center py-2 pl-2 xl:hidden">
        <HamburgerButton isOpen={isOpen} />
      </DrawerTrigger>
      <DrawerContent className="border-primary/40 bg-slate-950">
        <DrawerHeader>
          <DrawerTitle className="text-center text-lg font-semibold text-white">
            Danh mục phim
          </DrawerTitle>
          <DrawerDescription className="line-clamp-1 text-center font-medium text-balance text-white/80">
            Khám phá những bộ phim hay nhất dành cho bạn.
          </DrawerDescription>
        </DrawerHeader>
        <div className="custom-scrollbar h-2/3 w-full overflow-y-auto py-6 text-primary">
          <Accordion
            type="single"
            collapsible
            className="flex h-full w-full flex-col justify-between"
          >
            {MOVIE_TYPES.map((type) => (
              <MobileNavItem
                setIsOpen={setIsOpen}
                key={type.slug}
                title={type.name}
                items={
                  type.slug === "quoc-gia"
                    ? countries
                    : type.slug === "the-loai"
                      ? categories
                      : undefined
                }
                href={type.slug}
              />
            ))}
          </Accordion>
        </div>
        <UserActions user={user} isMobile={true} setIsOpen={setIsOpen} />
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNav
