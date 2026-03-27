"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-5 text-center text-white">
      <h2 className="mb-4 text-2xl font-bold text-red-500">
        Ối! Server đang bận hoặc bảo trì rồi 😅
      </h2>
      <p className="mb-6 text-gray-400">
        Đừng lo, bấm nút bên dưới để tải lại trang nhé.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-yellow-500 px-6 py-2 font-bold text-black transition-all hover:bg-yellow-400"
      >
        Thử lại ngay
      </button>
    </div>
  )
}
