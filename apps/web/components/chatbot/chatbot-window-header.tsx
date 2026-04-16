"use client"

import { memo } from "react"

const ChatbotWindowHeader = memo(() => {
  return (
    <div className="rounded-t-md border-b bg-linear-to-r from-orange-400 via-amber-400 to-yellow-300 p-4 text-white">
      <h3 className="font-semibold">Trợ lý AI NTK phim</h3>
      <p className="text-sm text-white opacity-90">
        Hỏi tui bất cứ phim gì nhé!
      </p>
    </div>
  )
})

export default ChatbotWindowHeader
