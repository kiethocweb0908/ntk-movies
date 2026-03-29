"use client"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { SearchIcon } from "lucide-react"
import SearchBar from "./search-bar"
import { useState } from "react"

const SearchMobile = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={"top"}>
      <DrawerTrigger className="text-white sm:hidden">
        <SearchIcon size={18} />
      </DrawerTrigger>
      <DrawerContent className="border-primary/20 bg-slate-900 text-white sm:hidden">
        <DrawerTitle className="hidden text-white">Tìm kiếm phim</DrawerTitle>

        <div className="p-5">
          <SearchBar hidden={false} setIsOpenMobiel={setIsOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default SearchMobile
