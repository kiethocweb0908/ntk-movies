"use client"

import { useEffect, useRef, useState } from "react"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { useApi } from "@/hooks/use-api"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Send, Users, MessageSquare, LogOut, Trash2, Hash } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

interface RoomChatPanelProps {
  roomCode: string
  roomId: string
  isHost: boolean
}

export default function RoomChatPanel({
  roomCode,
  roomId,
  isHost,
}: RoomChatPanelProps) {
  const { callApi } = useApi()
  const router = useRouter()
  const emitEvent = useWatchTogetherStore((s) => s.emitEvent)
  const messages = useWatchTogetherStore((s) => s.messages)
  const participants = useWatchTogetherStore((s) => s.participants)
  const clearState = useWatchTogetherStore((s) => s.clearState)

  const [activeTab, setActiveTab] = useState<"chat" | "users">("chat")
  const [inputMessage, setInputMessage] = useState("")
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    emitEvent("send-message", {
      roomCode,
      content: inputMessage.trim(),
    })
    setInputMessage("")
  }

  const handleLeaveOrDisband = async () => {
    const endpoint = isHost
      ? `/watch-together/disband-room/${roomId}`
      : `/watch-together/leave-room/${roomId}`
    const method = "DELETE"

    try {
      await callApi(endpoint, { method })
      toast.success(isHost ? "Đã giải tán phòng!" : "Đã rời phòng!")
      clearState()
      router.push("/xem-chung")
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra!")
    }
  }

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-900/60 backdrop-blur-md lg:h-full">
      {/* Tiêu đề hiển thị Room Code */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/80 p-3">
        <span className="text-sm font-semibold text-slate-300">Mã phòng:</span>
        <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-sm font-bold text-yellow-400">
          <Hash size={14} /> {roomCode}
        </div>
      </div>

      <div className="flex border-b border-white/5 bg-slate-900/80 p-2">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all",
            activeTab === "chat"
              ? "bg-primary font-bold text-slate-950"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <MessageSquare size={16} />
          Trò chuyện ({messages.filter((m) => m.type === "user").length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all",
            activeTab === "users"
              ? "bg-primary font-bold text-slate-950"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <Users size={16} />
          Thành viên ({participants.length})
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {/* (Render Nội dung như cũ - Giữ nguyên logic map qua messages / participants) */}
        {activeTab === "chat" ? (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              if (msg.type === "system") {
                return (
                  <div
                    key={index}
                    className="mx-auto flex w-fit justify-center rounded-full bg-white/5 px-3 py-1 text-center text-xs text-slate-500 italic"
                  >
                    {msg.content}
                  </div>
                )
              }
              return (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-yellow-400/80">
                    {msg.userName || msg.userEmail}
                  </span>
                  <div className="w-fit max-w-[90%] rounded-lg border border-white/5 bg-slate-800/80 p-3 text-sm break-words text-slate-200">
                    {msg.content}
                  </div>
                </div>
              )
            })}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-slate-800/40 p-2.5"
              >
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback className="bg-slate-700 text-sm font-semibold text-white">
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200">
                    {user.firstName
                      ? `${user.firstName} ${user.lastName || ""}`.trim()
                      : user.email}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {user.id === roomId ? "Host" : "Thành viên"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-white/5 bg-slate-900/85 p-3">
        {activeTab === "chat" && (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border-white/10 bg-slate-800 text-white focus:border-yellow-400 focus:ring-yellow-400"
            />
            <Button
              type="submit"
              variant="filter"
              size="icon"
              className="h-9 w-9 cursor-pointer rounded-lg"
            >
              <Send size={16} />
            </Button>
          </form>
        )}

        <Button
          onClick={handleLeaveOrDisband}
          variant={isHost ? "destructive" : "secondary"}
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-semibold"
        >
          {isHost ? (
            <>
              <Trash2 size={16} /> Giải tán phòng
            </>
          ) : (
            <>
              <LogOut size={16} /> Rời phòng
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
