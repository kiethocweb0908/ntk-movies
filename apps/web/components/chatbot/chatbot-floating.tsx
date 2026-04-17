"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import ChatbotWindow from "./chatbot-window"

export function ChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-yellow-400 shadow-lg transition-transform hover:scale-105 hover:bg-textHover"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="end"
          className="mb-25 ml-3 h-125 w-95 border-muted bg-slate-900 p-0 shadow-2xl sm:mr-15 sm:mb-0 sm:ml-0"
        >
          <ChatbotWindow />
        </PopoverContent>
      </Popover>
    </div>
  )
}
