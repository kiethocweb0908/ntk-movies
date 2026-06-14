"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import SearchBar from "@/components/search/search-bar"
import { useEffect, useState } from "react"
import { MovieCard } from "@/components/movie/movie-card"
import { MovieResponse } from "@workspace/shared/schema/movie/movie.response"
import { useForm } from "react-hook-form"
import {
  createRoomSchema,
  createRoomType,
} from "@workspace/shared/schema/room/room.dto"
import { zodResolver } from "@hookform/resolvers/zod"
import { useApi } from "@/hooks/use-api"
import { useAuthStore } from "@/store/use-auth-store"
import { useWatchTogetherStore } from "@/store/use-watch-together-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"

const CreateRoomForm = () => {
  const { callApi } = useApi()
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const setCurrentRoom = useWatchTogetherStore((s) => s.setCurrentRoom)
  const emitEvent = useWatchTogetherStore((s) => s.emitEvent)

  const [selectedMovie, setSelectedMovie] = useState<MovieResponse | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<createRoomType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      isPrivate: false,
      name: "",
      password: "",
      movieId: "",
      episodeId: null,
    },
    mode: "all",
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form

  const isPrivate = watch("isPrivate")

  // tự động xoá mật khẩu
  useEffect(() => {
    if (!isPrivate) {
      setValue("password", "")
      clearErrors("password")
    }
  }, [isPrivate, setValue])

  const onSelectMovie = (movie: MovieResponse) => {
    setSelectedMovie(movie)
    setValue("movieId", movie.id, { shouldValidate: true })
  }

  const onSubmit = async (data: createRoomType) => {
    if (isRedirecting) return

    if (!data.name?.trim()) data.name = `phòng xem của: ${user?.firstName}`

    const createRoomPromise = callApi<any>("/watch-together/create-room", {
      method: "POST",
      body: JSON.stringify(data),
    })

    toast.promise(createRoomPromise, {
      loading: "Đang xử lý...",
      success: (res) => {
        setIsRedirecting(true)
        if (res.data?.room) {
          setCurrentRoom(res.data.room)
          // Fix #2: broadcast to lobby in real-time
          emitEvent("announce-room-created", { room: res.data.room })
        }
        router.push(
          `/xem-chung/${res.data?.room?.roomCode || res.data?.roomCode}`
        )
        return res.message || "Tạo phòng thành công!"
      },
      error: (err: any) => {
        setIsRedirecting(false)
        return err.message
      },
    })
  }

  return (
    <Card className="overflow-auto rounded-2xl bg-slate-900 p-0">
      <CardContent className="min-h-138">
        {user ? (
          <FieldGroup className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-white">
                Tạo phòng xem chung
              </h1>
              <p className="text-sm text-balance text-white">
                Chọn phim để tạo phòng xem chung với bạn bè
              </p>
            </div>

            {/* Tìm phim */}
            <Field>
              <SearchBar
                hidden={false}
                onSelectMovie={onSelectMovie}
                limit={10}
              />
            </Field>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Tên phòng */}
              <Field className="text-white">
                <FieldLabel htmlFor="name-room">Tên phòng</FieldLabel>
                <Input
                  id="name-room"
                  placeholder={`Phong xem của: ${user!.firstName!}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </Field>

              {/* Phim */}
              <Field className="animate-in text-white fade-in slide-in-from-top-2">
                <FieldLabel htmlFor="name-room">Phim đang chọn</FieldLabel>
                {selectedMovie ? (
                  <div className="rounded-lg border border-primary/20 bg-slate-800/50">
                    <MovieCard movie={selectedMovie} isHorizontal={true} />
                  </div>
                ) : (
                  <div
                    {...register("movieId")}
                    className="flex h-18 w-full items-center justify-center rounded-xl border border-primary/10 p-2 text-primary/50"
                  >
                    Bạn cần phải chọn phim
                  </div>
                )}
                {errors.movieId && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.movieId.message}
                  </p>
                )}
              </Field>

              {/* Mật khẩu */}
              <Field className="text-white">
                <FieldLabel htmlFor="password">
                  <Checkbox
                    id="check"
                    checked={isPrivate}
                    onCheckedChange={(checked) =>
                      setValue("isPrivate", !!checked)
                    }
                    className="h-5 w-5! border-primary/20 data-checked:border-primary/20 data-checked:bg-transparent data-checked:text-yellow-400"
                  />
                  <label
                    htmlFor="check"
                    className={`text-sm select-none ${isPrivate ? "text-textHover" : "text-white"}`}
                  >
                    Phòng riêng tư
                  </label>
                </FieldLabel>
                <Input
                  id="password"
                  type={"text"}
                  disabled={!isPrivate}
                  placeholder={isPrivate ? "- - - - - -" : ""}
                  className="text-center text-xl! -tracking-tighter! disabled:bg-slate-800"
                  maxLength={6}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Nút tạo phòng*/}
              <Field>
                <Button
                  variant={"filter"}
                  className="py-2 text-lg"
                  type="submit"
                  disabled={isSubmitting || isRedirecting}
                >
                  {isSubmitting || isSubmitting
                    ? "Đang xử lý..."
                    : " Tạo phòng"}
                </Button>
              </Field>
            </form>
          </FieldGroup>
        ) : (
          <div className="flex h-138 w-full items-center justify-center gap-2 text-white">
            <LoaderIcon size={18} className="animate-spin" />
            Đang tải...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CreateRoomForm
