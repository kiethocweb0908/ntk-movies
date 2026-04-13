"use client"
import { Button } from "@workspace/ui/components/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import Link from "next/link"
import { LogOut, Settings, ShieldCheck, User } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useApi } from "@/hooks/use-api"

const UserActions = ({ user }: { user: any | null }) => {
  const { callApi } = useApi()
  const router = useRouter()
  const [isAction, setIsAction] = useState(false)

  if (!user) {
    return (
      <Link href="/dang-nhap" className="text-white hover:text-textHover">
        <Button variant="filter" className="cursor-pointer px-3">
          Đăng nhập
        </Button>
      </Link>
    )
  }

  const handleLogout = async () => {
    if (isAction) return
    const logoutPromise = callApi<{ message: string }>("/auth/logout", {
      method: "POST",
    })

    setIsAction(true)

    toast.promise(logoutPromise, {
      loading: "Đang xử lý...",
      success: (data) => {
        setTimeout(() => {
          setIsAction(false)
        }, 2000)
        router.push("/dang-nhap")
        router.refresh()
        return data.message || "Đăng xuất thành công!"
      },
      error: (err) => {
        setIsAction(false)
        return err.message || "Lỗi khi đăng xuất!"
      },
    })
  }

  return (
    <DropdownMenu>
      {/* Phần bấm vào để mở Menu */}
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-3 outline-none">
          <span className="hidden text-sm font-medium text-white md:block">
            {user.firstName || user.userName}
          </span>
          <Avatar className="size-9 border-2 border-yellow-500 transition-transform hover:scale-105">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-slate-800 text-white">
              {user.userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      {/* Nội dung Menu xuất hiện bên dưới */}
      <DropdownMenuContent
        className="w-56 border-slate-800 bg-slate-900 text-white"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium text-yellow-500">
              {user.userName}
            </p>
            <p className="text-xs leading-none text-slate-400">
              {user.role.slug}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-800" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-yellow-500">
            <User className="mr-2 size-4" />
            <span>Thông tin cá nhân</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer focus:bg-slate-800 focus:text-yellow-500">
            <Settings className="mr-2 size-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem className="cursor-pointer text-blue-400 focus:bg-slate-800 focus:text-yellow-500">
              <ShieldCheck className="mr-2 size-4" />
              <span>Quản trị phim</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-800" />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isAction}
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
        >
          <LogOut className="mr-2 size-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserActions
