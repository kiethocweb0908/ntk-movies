import { Logo } from "./header/logo"

const Footer = () => {
  return (
    <footer className="border-y border-primary/20 bg-background">
      <div className="mx-auto flex w-full flex-col items-center p-5 py-10">
        <Logo />

        <div className="max-w-lg">
          <p className="mt-2 text-center text-sm leading-relaxed text-balance text-muted-foreground">
            Trang web này được phát triển với mục đích học tập và thực hành xây
            dựng ứng dụng Web. Dữ liệu và hình ảnh được sử dụng từ các nguồn API
            công khai.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
