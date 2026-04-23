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
import { useAuthStore } from "@/store/use-auth-store"
import { UserResponse } from "@workspace/shared/schema/auth/auth.response"
import { useChatbotStore } from "@/store/use-chatbot-store"
import { PROFILE_URL } from "@workspace/ui/lib/config"

interface UserActionsProps {
  user: UserResponse | null
  isMobile?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const UserActions = ({
  user,
  isMobile = false,
  setIsOpen,
}: UserActionsProps) => {
  const { callApi } = useApi()
  const router = useRouter()
  const [isAction, setIsAction] = useState(false)
  const userStore = useAuthStore((s) => s.user)
  const clearMessages = useChatbotStore((s) => s.clearMessages)
  const logout = useAuthStore((s) => s.logout)
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const currentUser = userStore || user

  const handleLogout = async () => {
    if (isAction) return
    const logoutPromise = callApi<{ message: string }>("/auth/logout", {
      method: "POST",
    })

    setIsAction(true)

    toast.promise(logoutPromise, {
      loading: "Đang xử lý...",
      success: (data) => {
        logout()
        clearMessages()
        setTimeout(() => {
          setIsAction(false)
        }, 2000)
        router.push("/dang-nhap")
        // router.refresh()
        return data.message || "Đăng xuất thành công!"
      },
      error: (err) => {
        setIsAction(false)
        return err.message || "Lỗi khi đăng xuất!"
      },
    })
  }

  if (!isMobile) {
    if ((!userStore && isInitialized) || !currentUser) {
      return (
        <Link href="/dang-nhap" className="text-white hover:text-textHover">
          <Button variant="filter" className="cursor-pointer px-3">
            Đăng nhập
          </Button>
        </Link>
      )
    }

    return (
      <DropdownMenu>
        {/* Phần bấm vào để mở Menu */}
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center gap-3 outline-none">
            <span className="hidden text-sm font-medium text-white md:block">
              {currentUser.firstName || currentUser.userName}
            </span>
            <Avatar className="size-9 border-2 border-yellow-500 transition-transform hover:scale-105">
              <AvatarImage src={currentUser.avatarUrl || ""} />
              <AvatarFallback className="bg-slate-800 text-white">
                {currentUser.userName?.charAt(0).toUpperCase()}
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
                {currentUser.userName}
              </p>
              <p className="text-xs leading-none text-slate-400">
                {currentUser.role}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-slate-800" />

          <DropdownMenuGroup className="hover:text-white! focus:text-white!">
            <DropdownMenuItem
              asChild
              className="cursor-pointer p-0 focus:bg-transparent focus:text-white!"
            >
              <Link
                href={`${PROFILE_URL}`}
                className="flex cursor-pointer items-center p-2 text-sm text-white! hover:bg-slate-700! hover:text-textHover!"
              >
                <User className="mr-2 size-4" />
                <span>Thông tin cá nhân</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-slate-800" />

          <Button
            onClick={handleLogout}
            disabled={isAction}
            variant={"destructive"}
            className="flex w-full cursor-pointer justify-start bg-red-50 text-red-400 focus:bg-red-500/10 focus:text-red-400"
          >
            <LogOut className="mr-2 size-4" />
            <span>Đăng xuất</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } else {
    const handleLinkClick = () => {
      if (setIsOpen) setIsOpen(false)
    }

    if ((!userStore && isInitialized) || !currentUser) {
      return (
        <div className="w-ful flex items-center gap-2 p-4 px-2">
          <Link
            href="/dang-nhap"
            onClick={handleLinkClick}
            className="w-full text-white hover:text-textHover"
          >
            <Button variant="filter" className="w-full cursor-pointer px-3">
              Đăng nhập
            </Button>
          </Link>

          <Link
            href="/dang-ky"
            onClick={handleLinkClick}
            className="w-full text-white hover:text-textHover"
          >
            <Button variant="filter" className="w-full cursor-pointer px-3">
              Đăng ký
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="mt-auto border-t border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Trái: Avatar + Thông tin */}
          <Link
            href={`${PROFILE_URL}`}
            onClick={handleLinkClick}
            className="flex items-center gap-3"
          >
            <Avatar className="size-10 border border-yellow-500">
              <AvatarImage src={currentUser.avatarUrl || ""} />
              <AvatarFallback>
                {currentUser.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-bold text-yellow-500">
                {currentUser.firstName || currentUser.userName}
              </span>
              <span className="line-clamp-1 text-xs text-slate-400">
                {currentUser.email || currentUser.userName}
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              handleLogout()
              handleLinkClick()
            }}
            disabled={isAction}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>
    )
  }
}
export default UserActions
