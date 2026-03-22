import { z } from "zod"

export const MovieQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),

  category: z.string().optional(),
  country: z.string().optional(),

  mood: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  chieurap: z.boolean().optional(),

  search: z.string().optional(),
  year: z.coerce.number().optional(),
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
