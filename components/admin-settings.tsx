"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import Navigation from "./navigation"
import URLShortenerSettings from "./url-shortener-settings"

export default function AdminSettings() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState("url-shortener")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{language === "en" ? "Settings" : "Cài đặt"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Configure your blog settings" : "Cấu hình cài đặt blog của bạn"}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("url-shortener")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "url-shortener"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {language === "en" ? "URL Shortener" : "Rút gọn URL"}
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">{activeTab === "url-shortener" && <URLShortenerSettings />}</div>
        </div>
      </main>
    </div>
  )
}
