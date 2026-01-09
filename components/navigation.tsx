"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          BlogHub
        </Link>
        <div className="flex gap-4 items-center">
          {/* <Link href="/" className="hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/admin" className="hover:text-primary transition-colors">
            {t("admin.dashboard")}
          </Link> */}
          <span className="text-sm text-muted-foreground">
            {t("home.language")}:
          </span>
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
          <Button
            variant={language === "vi" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("vi")}
          >
            Tiếng Việt
          </Button>
        </div>
      </div>
    </nav>
  );
}
