"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"

export default function Navigation() {
  const { t, language } = useLanguage()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          BlogHub
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/admin" className="hover:text-primary transition-colors">
            {t("admin.dashboard")}
          </Link>
        </div>
      </div>
    </nav>
  )
}
