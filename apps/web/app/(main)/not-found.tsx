// app/not-found.tsx
import Link from "next/link"
import { Logo } from "@/components/layout/header/logo"
import { Button } from "@workspace/ui/components/button"

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center text-primary">
      <div className="mb-8">
        <Logo />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
        Oops! Lạc trôi rồi
      </h1>

      <p className="mb-8 max-w-md text-muted-foreground">
        Trang bạn đang tìm kiếm hiện không tồn tại hoặc đã bị "bay màu" khỏi hệ
        thống của NTK Phim.
      </p>

      <div className="flex flex-row gap-3 sm:gap-4">
        <Link href="/">
          <Button
            type="button"
            variant={"filter"}
            className="rounded-full px-8! py-7! transition-transform hover:scale-105 active:scale-95"
          >
            Về trang chủ
          </Button>
        </Link>

        <Link href="/tim-kiem">
          <Button
            type="button"
            variant={"outline"}
            className="rounded-full px-8! py-7! transition-transform hover:scale-105 active:scale-95"
          >
            Tìm phim khác
          </Button>
        </Link>
      </div>

      <div className="mt-16 animate-bounce text-sm text-muted-foreground select-none">
        Thử nhấn nút Home xem có bất ngờ không nhé! 😉
      </div>
    </div>
  )
}

export default NotFound
