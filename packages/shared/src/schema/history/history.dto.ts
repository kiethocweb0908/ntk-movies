import { z } from "zod"

export const UpdateHistorySchema = z.object({
  episodeId: z.string(),
  currentTime: z.number(),
  duration: z.number(),
})

export type UpdateHistoryType = z.infer<typeof UpdateHistorySchema>
