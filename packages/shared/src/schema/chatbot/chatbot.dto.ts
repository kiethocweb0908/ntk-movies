import { z } from "zod"

export const ChatBotSchema = z.object({
  message: z.string().min(1),
})

export const IntentSchema = z.object({
  intent: z.enum(["movie_search", "normal_chat"]),
  keyword: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
  type: z.enum(["single", "series", "hoathinh"]).nullable().optional(),
})

export type IntentType = z.infer<typeof IntentSchema>
