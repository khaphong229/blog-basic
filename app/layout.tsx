import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

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
  title: "Dev Blog | Thoughts & Tutorials",
  description:
    "A clean, minimalist blog for developers. Sharing insights, tutorials, and tech stories.",
  keywords: ["blog", "developer", "programming", "tech", "tutorials"],
  authors: [{ name: "Dev Blog" }],
  creator: "Dev Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Dev Blog",
    title: "Dev Blog | Thoughts & Tutorials",
    description: "A clean, minimalist blog for developers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Blog | Thoughts & Tutorials",
    description: "A clean, minimalist blog for developers",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
