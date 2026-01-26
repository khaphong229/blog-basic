"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
            <GraduationCap className="text-primary h-6 w-6" />
          </div>
          <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
            EduBlog
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="mr-4 hidden items-center gap-6 md:flex">
            {/* Future navigation items can go here */}
            {/* <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Courses</Link>
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Mentors</Link> */}
          </div>

          <div className="bg-secondary/5 border-secondary/10 flex items-center gap-2 rounded-full border p-1">
            <Button
              variant={language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("en")}
              className={`h-8 rounded-full px-4 text-xs font-medium transition-all ${
                language === "en"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              }`}
            >
              English
            </Button>
            <Button
              variant={language === "vi" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("vi")}
              className={`h-8 rounded-full px-4 text-xs font-medium transition-all ${
                language === "vi"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              }`}
            >
              Tiếng Việt
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
