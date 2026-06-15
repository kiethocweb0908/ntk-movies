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
import { GetMeResponse } from "@workspace/shared/schema/auth/auth.response"
import { AppResponse } from "@workspace/shared/schema/movie/movie.response"
import { Metadata } from "next"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "NTK Phim - Phim hay chất lượng",
  description: "Website xem phim chất lượng cao của NTK",
  icons: {
    icon: "/favicon.webp",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const getMe = async (): Promise<AppResponse<GetMeResponse> | null> => {
    const cookieStore = await cookies()
    const hasToken =
      cookieStore.has("accessToken") || cookieStore.has("refreshToken")

    if (hasToken)
      return await api<AppResponse<GetMeResponse>>("/auth/me", {
        cache: "no-store",
      })
    return null
  }

  // fetch category và country
  const [categories, countries, auth] = await Promise.all([
    api<CategoryResponse[]>("/category", {
      next: { revalidate: 604800 },
    }).catch(() => []),
    api<CountryResponse[]>("/country", {
      next: { revalidate: 604800 },
    }).catch(() => []),
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
          user={auth?.data!.user || null}
          favIds={auth?.data!.favIds || null}
        />
        <ThemeProvider>
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
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
