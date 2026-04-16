"use client"

import { Messages } from "@workspace/shared/schema/chatbot/chatbot.response"
import { memo, useEffect, useRef } from "react"
import TypingIndicator from "./typing-indicator"
import ChatbotMessageItem from "./chatbot-message-item"

interface BodyProps {
  messages: Messages[]
  isLoading: boolean
}

const ChatbotWindowBody = memo(({ messages, isLoading }: BodyProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="scrollbar-hide custom-scrollbar h-95 space-y-3 overflow-y-auto bg-slate-900 p-4">
      {messages.map((msg, index) => (
        <ChatbotMessageItem msg={msg} key={index} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
})

export default ChatbotWindowBody
