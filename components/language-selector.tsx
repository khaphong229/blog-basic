"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="border-b border-border bg-card/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground">{t("home.language")}:</span>
        <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
          English
        </Button>
        <Button variant={language === "vi" ? "default" : "outline"} size="sm" onClick={() => setLanguage("vi")}>
          Tiếng Việt
        </Button>
      </div>
    </div>
  )
}
