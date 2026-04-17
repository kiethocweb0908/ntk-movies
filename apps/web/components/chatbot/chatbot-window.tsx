"use client"

import { useCallback, useEffect, useState } from "react"
import ChatbotWindowBody from "./chatbot-window-body"
import ChatbotWindowHeader from "./chatbot-window-header"
import ChatbotWindowInput from "./chatbot-window-input"
import { api } from "@/lib/api"
import {
  ChatbotResponse,
  Messages,
} from "@workspace/shared/schema/chatbot/chatbot.response"
import { toast } from "sonner"

const ChatbotWindow = () => {
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<Messages[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("ntk_phim_chatbot_messages")
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem(
        "ntk_phim_chatbot_messages",
        JSON.stringify(messages)
      )
  }, [messages])

  // gửi tin
  const handleSend = useCallback(async () => {
    const messageContent = value.trim()
    if (!messageContent || isLoading) return

    const userMessage: Messages = {
      id: crypto.randomUUID(),
      isBot: false,
      type: "text",
      message: messageContent,
    }

    const historyPayload = messages.slice(-5).map((msg) => ({
      role: msg.isBot ? "model" : ("user" as "model" | "user"),
      parts: [{ text: msg.message }],
    }))

    setMessages((prev) => [...prev, userMessage])
    setValue("")
    setIsLoading(true)

    try {
      const res = await api<ChatbotResponse>("/chatbot", {
        method: "POST",
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload,
        }),
      })

      const botMessage: Messages = {
        id: "", // tạo id sao bạn
        isBot: true,
        type: res.type,
        message: res.message,
        movies: res.type === "movie" ? res.movies : undefined,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }, [value, isLoading])

  // phím enter
  const handleKeyPress = useCallback(
    async (e: React.KeyboardEvent) => {
      const isModifierPressed = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey
      if (e.key === "Enter" && !isModifierPressed) {
        e.preventDefault()
        await handleSend()
      }
    },
    [handleSend]
  )

  return (
    <>
      {/* Header */}
      <ChatbotWindowHeader />

      {/* Phần nội dung Chat (Nơi ông sẽ nối API handleChat) */}
      <ChatbotWindowBody isLoading={isLoading} messages={messages} />

      {/* Input nhập liệu */}
      <ChatbotWindowInput
        setValue={setValue}
        value={value}
        handleKeyPress={handleKeyPress}
        handleSend={handleSend}
        loading={isLoading}
      />
    </>
  )
}

export default ChatbotWindow
