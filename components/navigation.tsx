"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Terminal, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 border-border border-b shadow-[0_0_20px_rgba(0,255,136,0.05)] backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <Terminal className="text-primary group-hover:text-glow-green h-6 w-6 transition-all" />
              <div className="bg-primary absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground group-hover:text-primary font-mono text-lg font-bold transition-colors">
                ./blog
              </span>
              <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                v1.0.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Status indicator */}
            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
              <span className="text-primary">[</span>
              <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
              <span>ONLINE</span>
              <span className="text-primary">]</span>
            </div>

            {/* Time */}
            <div className="text-muted-foreground border-border border px-3 py-1 font-mono text-xs">
              <span className="text-primary">$</span> {currentTime}
            </div>

            {/* Language selector */}
            <div className="border-border flex items-center gap-1 border">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("en")}
                className="h-8 text-xs"
              >
                EN
              </Button>
              <div className="bg-border h-4 w-px" />
              <Button
                variant={language === "vi" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("vi")}
                className="h-8 text-xs"
              >
                VI
              </Button>
            </div>

            {/* Admin link */}
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs">
                <span className="text-primary mr-1">&gt;</span>
                {t("admin.dashboard")}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="text-foreground hover:text-primary p-2 transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-border bg-background/95 border-t backdrop-blur-sm md:hidden"
          >
            <div className="space-y-4 py-4">
              {/* Status */}
              <div className="text-muted-foreground flex items-center justify-between px-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-primary">&gt;</span>
                  <span>STATUS:</span>
                  <span className="text-primary">ONLINE</span>
                </div>
                <span>{currentTime}</span>
              </div>

              {/* Language */}
              <div className="px-4">
                <div className="text-muted-foreground mb-2 font-mono text-xs">
                  <span className="text-primary">$</span> {t("home.language")}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                    className="flex-1"
                  >
                    English
                  </Button>
                  <Button
                    variant={language === "vi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("vi")}
                    className="flex-1"
                  >
                    Tiếng Việt
                  </Button>
                </div>
              </div>

              {/* Admin link */}
              <div className="px-4">
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="terminal" className="w-full">
                    {t("admin.dashboard")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
