"use client"

import { clearAuthCookies } from "@/lib/auth-actions"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number; code?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isSessionExpired = error.message === "SESSION_EXPIRED"
  const isBackendDown = error.message === "BACKEND_UNAVAILABLE"

  useEffect(() => {
    if (isRedirecting) return
    const processError = async () => {
      if (isSessionExpired) {
        setIsRedirecting(true)
        await clearAuthCookies()
        toast.error("Phiên đăng nhập của bạn đã hết hạn!")
        // window.location.href = "/dang-nhap"
        router.push("/dang-nhap")
        router.refresh()
      }
    }
    processError()
  }, [error])

  const resett = () => {
    router.refresh()
  }

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center p-5 text-center">
      <h2 className="mb-2 text-2xl font-bold text-red-500">
        {isSessionExpired
          ? "Phiên đăng nhập hết hạn, vui lòng đợi trong giây lát."
          : isBackendDown
            ? "Server đang bảo trì hoặc chưa khởi động"
            : "Đã xảy ra lỗi!"}
      </h2>
      <p className="mb-6 text-muted-foreground">
        {isSessionExpired
          ? "Đang chuyển hướng"
          : error.message || "Chúng tôi không thể tải dữ liệu lúc này."}
      </p>

      {!isRedirecting && (
        <button
          onClick={() => resett()}
          className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}
