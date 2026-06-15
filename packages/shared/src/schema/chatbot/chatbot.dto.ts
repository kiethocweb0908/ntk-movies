import { z } from "zod"

const MessagePartSchema = z.object({
  text: z.string(),
})

export const ChatbotHistorySchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(MessagePartSchema),
})
export const ChatBotSchema = z.object({
  message: z.string().min(1, "Tin nhắn không được để trống"),
  history: z.array(ChatbotHistorySchema).optional(),
})

export const IntentSchema = z.object({
  intent: z.enum(["movie_search", "normal_chat"]),

  keyword: z.string().trim().nullable().optional(),
  normalizedKeyword: z.string().trim().nullable().optional(),

  genre: z.string().trim().nullable().optional(),
  normalizedGenre: z.string().trim().nullable().optional(),

  country: z.string().trim().nullable().optional(),
  normalizedCountry: z.string().trim().nullable().optional(),

  mood: z.string().trim().nullable().optional(),

  theme: z.string().trim().nullable().optional(),

  year: z.number().nullable().optional(),

  type: z.enum(["single", "series", "hoathinh"]).nullable().optional(),

  isTopQuery: z.boolean().optional(),
  isChieurap: z.boolean().optional(),
})

export type IntentType = z.infer<typeof IntentSchema>
export type ChatbotHistory = z.infer<typeof ChatbotHistorySchema>
export type ChatBotType = z.infer<typeof ChatBotSchema>
