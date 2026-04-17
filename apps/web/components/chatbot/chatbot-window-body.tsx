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

  if (!messages.length) {
    return (
      <div className="flex min-h-95 flex-col items-center justify-center gap-4 p-4 text-white">
        <h3 className="bg-linear-to-r from-orange-400 via-amber-400 to-yellow-100 bg-clip-text text-xl leading-tight font-semibold -tracking-tight text-transparent">
          Trợ lý ảo NTK phim
        </h3>
        <div className="flex justify-start">
          <div className="rounded-2xl bg-slate-800 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 animate-bounce rounded-full bg-orange-400 animation-duration-[0.8s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-amber-400 animation-duration-[0.8s] [animation-delay:0.2s]" />
              <span className="h-3 w-3 animate-bounce rounded-full bg-yellow-400 animation-duration-[0.8s] [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

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
