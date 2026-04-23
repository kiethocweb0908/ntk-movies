import Profile from "@/components/profile/profile"
import { api } from "@/lib/api"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!accessToken && !refreshToken) redirect("/")

  return (
    <main className="px-5 pt-28 text-white">
      <Profile />
    </main>
  )
}

export default ProfilePage
