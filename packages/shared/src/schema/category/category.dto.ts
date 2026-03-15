import { z } from "zod"

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Tên thể loại quá ngắn"),
  slug: z.string().min(2),
})

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>
