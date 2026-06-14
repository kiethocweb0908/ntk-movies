import { z } from "zod"

export const createRoomSchema = z
  .object({
    name: z
      .string()
      .min(3, "Tên ít nhất 3 ký tự")
      .max(50, "Tên không dài quá 50 ký tự")
      .optional()
      .or(z.literal("")),
    movieId: z
      .string()
      .min(1, "Vui lòng chọn phim")
      .uuid("ID phim không hợp lệ"),
    episodeId: z
      .string()
      .uuid("ID tập phim không hợp lệ")
      .optional()
      .nullable(),

    isPrivate: z.boolean(),
    password: z
      .string()
      .length(6, "Mật khẩu phải đúng 6 ký tự")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.isPrivate && (!data.password || data.password.length != 6)) {
        return false
      }
      return true
    },
    {
      message: "Phòng riêng tư yêu cầu mật khẩu 6 ký tự",
      path: ["password"],
    }
  )

export const joinRoomSchema = z.object({
  roomCode: z.string(),
  password: z.string().optional(),
})

export const GetRoomsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
})

export type createRoomType = z.infer<typeof createRoomSchema>
export type joinRoomType = z.infer<typeof joinRoomSchema>
export type GetRoomsType = z.infer<typeof GetRoomsSchema>
