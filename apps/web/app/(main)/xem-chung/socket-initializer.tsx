"use client"

import { useEffect, useRef } from "react"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

export const SocketInitializer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const connect = useWatchTogetherStore((state) => state.connect)
  const disconnect = useWatchTogetherStore((state) => state.disconnect)
  const isConnected = useWatchTogetherStore((state) => state.isConnected)
  const user = useAuthStore((s) => s.user)

  const pathname = usePathname()
  const emitEvent = useWatchTogetherStore((s) => s.emitEvent)
  const isInLobby = useRef(false)

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect, user])

  useEffect(() => {
    if (!isConnected) return

    const lobbyPaths = ["/xem-chung", "/xem-chung/tao-phong"]
    const isTargetLobby = lobbyPaths.includes(pathname)

    if (isTargetLobby && !isInLobby.current) {
      emitEvent("join-lobby", {})
      isInLobby.current = true
      console.log("Đã vào lobby")
    } else if (!isTargetLobby && isInLobby.current) {
      emitEvent("leave-lobby", {})
      isInLobby.current = false
      console.log("Đã rời lobby")
    }
  }, [pathname, emitEvent, isConnected])

  return <>{children}</>
}
