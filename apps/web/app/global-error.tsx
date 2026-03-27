"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-black p-5 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold text-red-600">
          Lỗi hệ thống nghiêm trọng! ⚠️
        </h2>
        <p className="mb-6 text-gray-400">
          Đã có sự cố xảy ra với khung giao diện chính (Root Layout). Vui lòng
          thử tải lại toàn bộ ứng dụng.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-red-600 px-8 py-3 font-bold text-white transition-all hover:bg-red-700"
        >
          Tải lại trang (Reset)
        </button>
      </body>
    </html>
  )
}
