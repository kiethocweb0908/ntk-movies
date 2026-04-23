import { useAuthStore } from "@/store/use-auth-store"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import React from "react"

const UserInfo = () => {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <section className="mb-5 flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
      <Avatar className="size-24 border-4 border-yellow-500 shadow-lg shadow-yellow-500/20">
        <AvatarImage src={user?.avatarUrl || ""} />
        <AvatarFallback className="bg-slate-800 text-2xl">
          {user?.userName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-yellow-500">
          {user?.firstName || user?.userName}
        </h1>
        <p className="text-slate-400">{user?.email}</p>
        <div className="mt-2 inline-block rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
          {user?.role}
        </div>
      </div>
    </section>
  )
}

export default UserInfo
