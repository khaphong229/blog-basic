import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import "highlight.js/styles/github.min.css"

/** Sans-serif font for body text and UI elements */
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

/** Serif font for editorial headings and hero text */
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "APKute | Chia sẻ APK hay & an toàn",
  description:
    "Chia sẻ ứng dụng Android hay, kèm link download APK an toàn. Cute & đáng tin cậy!",
  keywords: ["apk", "download", "android", "ứng dụng", "app", "APKute"],
  authors: [{ name: "APKute" }],
  creator: "APKute",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "APKute",
    title: "APKute | Chia sẻ APK hay & an toàn",
    description: "Chia sẻ ứng dụng Android hay, kèm link download APK an toàn",
  },
  twitter: {
    card: "summary_large_image",
    title: "APKute | Chia sẻ APK hay & an toàn",
    description: "Chia sẻ ứng dụng Android hay, kèm link download APK an toàn",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${inter.variable} ${playfairDisplay.variable} bg-background text-foreground`}>
        <ThemeProvider>
          <LanguageProvider>
            <BlogProvider>{children}</BlogProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
