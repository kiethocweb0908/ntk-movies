import { create } from "zustand"
import { Messages } from "@workspace/shared/schema/chatbot/chatbot.response"

interface ChatbotState {
  messages: Messages[]
  isLoading: boolean

  setLoading: (loading: boolean) => void

  addMessage: (message: Messages) => void
  setMessages: (messages: Messages[]) => void
  clearMessages: () => void
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  messages: [],
  isLoading: false,

  setLoading: (isLoading) => set({ isLoading }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () =>
    set({
      messages: [],
      isLoading: false,
    }),
}))
