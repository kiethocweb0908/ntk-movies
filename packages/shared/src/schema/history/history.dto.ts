import { z } from "zod"

export const UpdateHistorySchema = z.object({
  episodeId: z.string(),
  currentTime: z.number(),
  duration: z.number(),
})

export const HistoyryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(32),
})

export type UpdateHistoryType = z.infer<typeof UpdateHistorySchema>
export type HistoyryQueryType = z.infer<typeof HistoyryQuerySchema>
