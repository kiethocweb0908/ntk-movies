import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import Header from "@/components/layout/header/header"
import Footer from "@/components/layout/footer"
import { api } from "@/lib/api"
import { CategoryResponse } from "@workspace/shared/schema/category/category.response"
import { CountryResponse } from "@workspace/shared/schema/country/country.response"
import { Toaster } from "sonner"
import { cookies } from "next/headers"
import { ChatbotFloating } from "@/components/chatbot/chatbot-floating"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getMe = async () => {
    const cookieStore = await cookies()
    const allCookies = cookieStore.toString()
    const hasToken =
      cookieStore.has("accessToken") || cookieStore.has("refreshToken")
    if (hasToken)
      return await api<{ user: any; message: string }>("/auth/me", {
        headers: {
          Cookie: allCookies,
        },
        cache: "no-store",
      })
    return null
  }

  // fetch category và country
  const [categories, countries, userData] = await Promise.all([
    api<CategoryResponse[]>("/category").catch(() => []),
    api<CountryResponse[]>("/country").catch(() => []),
    getMe().catch(() => null),
  ])
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <Header
          categories={categories}
          countries={countries}
          user={userData?.user || null}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <Footer />
        <ChatbotFloating />
        <Toaster
          position="bottom-right"
          duration={3000}
          richColors
          expand={true}
          visibleToasts={7}
          className="select-none"
          // closeButton
        />
      </body>
    </html>
  )
}
