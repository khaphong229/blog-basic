"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import Navigation from "./navigation"
import URLShortenerSettings from "./url-shortener-settings"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Link2, ChevronRight } from "lucide-react"

export default function AdminSettings() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState("url-shortener")

  // Settings navigation items
  const settingsNav = [
    {
      id: "url-shortener",
      label: language === "en" ? "URL Shortener" : "Rút gọn URL",
      description: language === "en" ? "Configure short links" : "Cấu hình liên kết ngắn",
      icon: Link2,
    },
    // Add more settings tabs here in the future
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 pt-8 pb-24 md:pt-12 md:pb-32">
        {/* Breadcrumb & Back */}
        <nav className="mb-6">
          <Link 
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {language === "en" ? "Back to Dashboard" : "Quay lại Dashboard"}
          </Link>
        </nav>

        {/* Page Header */}
        <header className="mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
              <Settings className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {language === "en" ? "Settings" : "Cài đặt"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === "en" ? "Configure your blog settings" : "Cấu hình cài đặt blog của bạn"}
              </p>
            </div>
          </div>
        </header>

        {/* Settings Layout - Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-1">
                {language === "en" ? "Settings Menu" : "Menu cài đặt"}
              </h3>
              <nav className="space-y-1">
                {settingsNav.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer group ${
                        isActive
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isActive 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted text-muted-foreground group-hover:text-foreground"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            isActive ? "text-primary" : "text-foreground"
                          }`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          isActive 
                            ? "text-primary translate-x-0" 
                            : "text-muted-foreground/50 -translate-x-1 group-hover:translate-x-0"
                        }`} />
                      </div>
                    </button>
                  )
                })}
              </nav>

              {/* Help Card */}
              <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-foreground mb-1">
                  {language === "en" ? "Need help?" : "Cần hỗ trợ?"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {language === "en" 
                    ? "Check our documentation for detailed guides." 
                    : "Xem tài liệu để được hướng dẫn chi tiết."}
                </p>
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                  {language === "en" ? "View Docs" : "Xem tài liệu"}
                </Button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-card/30 rounded-2xl border border-border/50 p-6 md:p-8">
              {activeTab === "url-shortener" && <URLShortenerSettings />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
