import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
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
      <body className={`font-sans antialiased ${inter.variable} bg-background text-foreground`}>
        <LanguageProvider>
          <BlogProvider>{children}</BlogProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
