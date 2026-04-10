import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const Page = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("reset_token")?.value
  const email = cookieStore.get("otp_email")?.value

  if (!token || !email) {
    redirect("/quen-mat-khau")
  }
  return <div>Page</div>
}

export default Page
