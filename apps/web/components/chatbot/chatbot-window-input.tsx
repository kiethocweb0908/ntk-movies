"use client"

import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Send } from "lucide-react"
import { memo } from "react"

interface ChatbotWindowInputProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  handleKeyPress: (e: React.KeyboardEvent) => void
  handleSend: () => void
  loading: boolean
}

const ChatbotWindowInput = memo(
  ({
    setValue,
    value,
    handleKeyPress,
    handleSend,
    loading,
  }: ChatbotWindowInputProps) => {
    return (
      <div className="flex items-center justify-between gap-2 border-t bg-slate-900 p-3">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          maxLength={50}
          rows={1}
          placeholder="Nhập câu hỏi cho trợ lý AI"
          className="w-full border-primary/40 bg-transparent text-sm text-primary outline-none"
        />
        <Button
          onClick={handleSend}
          variant={null}
          className="transition-smooth hover:shadow-glow bg-yellow-400 hover:scale-105"
          disabled={loading || !value.trim()}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    )
  }
)

export default ChatbotWindowInput
