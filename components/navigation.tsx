"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code2, Menu, X, LayoutDashboard } from "lucide-react"

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

  // Time effect removed for clean design


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 border-border border-b shadow-sm backdrop-blur-md"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Code2 className="text-primary h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-lg font-bold tracking-tight">
                DevBlog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Clean Spacer */}
            <div className="hidden lg:block" />

            {/* Language selector */}
            {/* Language selector - Clean style */}
            <div className="bg-muted/50 flex items-center gap-1 rounded-full p-1">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={`h-7 rounded-full text-xs px-3 ${language === "en" ? "bg-white text-black shadow-sm hover:bg-white/90" : "hover:bg-transparent"}`}
              >
                EN
              </Button>
              <Button
                variant={language === "vi" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLanguage("vi")}
                className={`h-7 rounded-full text-xs px-3 ${language === "vi" ? "bg-white text-black shadow-sm hover:bg-white/90" : "hover:bg-transparent"}`}
              >
                VI
              </Button>
            </div>

            {/* Admin link */}
            {/* Admin link */}
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm font-medium">
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
                  <Button variant="default" className="w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
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
