import { z } from "zod"

export const BaseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
})

export type BaseType = z.infer<typeof BaseSchema>
