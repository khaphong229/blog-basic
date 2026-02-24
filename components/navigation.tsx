"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"

/**
 * Main navigation bar — Chameleon.io inspired clean SaaS style.
 * Features: sticky header, serif brand logo, language toggle, theme toggle.
 */
export default function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    /** Track scroll position for header background transition */
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

          {/* Logo — Serif font for editorial feel */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">D</span>
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              DevBlog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {/* Nav Links */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                {language === "en" ? "Blog" : "Bài viết"}
              </Button>
            </Link>
            <Link href="/tiktok">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                TikTok
              </Button>
            </Link>

            {/* Separator */}
            <div className="mx-2 h-5 w-px bg-border" />

            {/* Language selector — pill toggle */}
            <div className="flex items-center gap-0.5 rounded-full bg-muted/60 p-0.5">
              <button
                onClick={() => setLanguage("en")}
                className={`h-7 rounded-full px-3 text-xs font-medium transition-all ${language === "en"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("vi")}
                className={`h-7 rounded-full px-3 text-xs font-medium transition-all ${language === "vi"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                VI
              </button>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Admin link */}
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm font-medium">
                <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
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
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-border bg-background/95 border-t backdrop-blur-sm md:hidden"
          >
            <div className="space-y-2 py-4">
              {/* Nav links */}
              <div className="px-4 space-y-1">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    {language === "en" ? "Blog" : "Bài viết"}
                  </Button>
                </Link>
                <Link href="/tiktok" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    TikTok
                  </Button>
                </Link>
              </div>

              {/* Language */}
              <div className="px-4 pt-2 border-t border-border/50">
                <div className="text-muted-foreground mb-2 text-xs font-medium">
                  {language === "en" ? "Language" : "Ngôn ngữ"}
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
              <div className="px-4 pt-2">
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
