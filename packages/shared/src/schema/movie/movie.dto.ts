import { z } from "zod"

export const MovieQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(32),

  categorySlug: z.string().optional(),
  countrySlug: z.string().optional(),
  type: z.string().optional(),

  search: z.string().optional(),
  year: z.coerce.number().optional(),

  sort: z.enum(["createdAt", "viewCount"]).default("createdAt"),
})

export const MovieMoodSchema = z.object({
  moodId: z.enum(
    ["combat", "cau-luong", "thao-tung", "chua-lanh", "sinh-ton"],
    {
      errorMap: () => ({ message: "Mood này không tồn tại!" }),
    }
  ),
})

export type MovieQuery = z.infer<typeof MovieQuerySchema>
