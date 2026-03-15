import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import Header from "@/components/layout/header/header"
import Footer from "@/components/layout/footer"
import { MainNav } from "@/components/layout/header/main-nav"

// import { type CategoryType } from "@workspace/shared"

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
        <Header mainNav={<MainNav />} />
        <ThemeProvider>{children}</ThemeProvider>
        <Footer />
      </body>
    </html>
  )
}
