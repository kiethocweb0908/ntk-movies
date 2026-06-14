import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SocketInitializer } from "./socket-initializer"

const WatchTogetherLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value
  if (!accessToken && !refreshToken) redirect("/dang-nhap")

  return (
    <SocketInitializer>
      <main className="min-h-screen w-full px-5 pt-28 pb-5 text-white">
        {children}
      </main>
    </SocketInitializer>
  )
}

export default WatchTogetherLayout
