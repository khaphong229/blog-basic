import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Terminal Blog | Developer's Journal",
  description:
    "A developer-focused blog with terminal aesthetic. Tutorials, insights, and tech stories.",
  keywords: ["blog", "developer", "programming", "terminal", "tech", "tutorials"],
  authors: [{ name: "Terminal Blog" }],
  creator: "Terminal Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Terminal Blog",
    title: "Terminal Blog | Developer's Journal",
    description: "A developer-focused blog with terminal aesthetic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terminal Blog | Developer's Journal",
    description: "A developer-focused blog with terminal aesthetic",
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
    <html lang="en" className="dark">
      <body className={`font-mono antialiased ${jetbrainsMono.variable}`}>
        <LanguageProvider>
          <BlogProvider>{children}</BlogProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
