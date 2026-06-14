"use client"

import TitleSection from "@/components/ui/tittle-section"
import RoomList from "@/components/watch-together/room-list"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { toast } from "sonner"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"

const FindRoomDialog = () => {
  const [code, setCode] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã phòng!")
      return
    }
    setOpen(false)
    router.push(`/xem-chung/${code.trim()}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"secondary"}
          className="cursor-pointer rounded-full px-8! py-7! transition-transform hover:scale-105 active:scale-95"
        >
          Tìm phòng
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-white/10 bg-slate-900 p-6 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Tìm phòng xem chung
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-center text-sm text-slate-300">
            Nhập mã phòng để tham gia cùng bạn bè
          </p>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã phòng..."
            maxLength={20}
            className="border-white/10 bg-slate-800 text-center text-lg text-white focus:border-yellow-400 focus:ring-yellow-400"
          />
          <Button
            type="submit"
            variant="filter"
            className="w-full py-3 text-base font-semibold"
          >
            Vào phòng
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const Page = () => {
  const socket = useWatchTogetherStore((s) => s.socket)
  const roomList = useWatchTogetherStore((s) => s.roomList)

  // Fix #2: real-time lobby update when a new room is created
  useEffect(() => {
    if (!socket) return

    const handleRoomCreated = (newRoom: any) => {
      // Prepend only if not already in the list (avoid duplicates if creator is also on lobby tab)
      useWatchTogetherStore.setState((state) => {
        const alreadyExists = state.roomList.some((r) => r.id === newRoom.id)
        if (alreadyExists) return state
        return { roomList: [newRoom, ...state.roomList] }
      })
    }

    socket.on("room-created", handleRoomCreated)
    return () => {
      socket.off("room-created", handleRoomCreated)
    }
  }, [socket])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex w-full flex-col items-center">
        <div className="absolute inset-0 -top-28 left-0 -z-40 h-78 w-full">
          <div className="absolute inset-0 z-10 flex w-full justify-between">
            <div className="w-1/5 bg-linear-to-r from-background to-transparent" />
            <div className="w-1/5 bg-linear-to-l from-background to-transparent" />
          </div>
          <Image
            src={"/bg-watch-together.webp"}
            alt="Image"
            fill
            sizes="1080px"
            className="h-full w-full object-cover brightness-[0.85]"
          />
        </div>
        <TitleSection
          title="Xem chung"
          className="bg-linear-to-r from-amber-400 via-textHover to-yellow-100 bg-clip-text text-3xl leading-tight font-bold -tracking-tight text-transparent xl:text-4xl!"
        />
        <div className="flex max-w-3xl items-center justify-center gap-3">
          <Link href={"xem-chung/tao-phong"}>
            <Button
              type="button"
              variant={"filter"}
              className="cursor-pointer rounded-full px-8! py-7! transition-transform hover:scale-105 active:scale-95"
            >
              Tạo phòng
            </Button>
          </Link>
          <FindRoomDialog />
        </div>
      </div>
      {/* Phòng xem */}
      <TitleSection title="Danh sách phòng xem" />
      <RoomList />
    </div>
  )
}

export default Page
