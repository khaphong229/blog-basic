"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { translate, type Language, type Messages, getTranslations } from "@/lib/i18n"

interface LanguageContextType {
  /** Current active language */
  language: Language
  /** Switch language */
  setLanguage: (lang: Language) => void
  /** Translate a dot-notation key (e.g. "blog.search") */
  t: (key: string, params?: Record<string, string>) => string
  /** Get the full messages object for current language (for direct property access) */
  messages: Messages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Language provider — loads translations from JSON files via lib/i18n.ts
 * Supports realtime language switching without page reload
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      return translate(language, key, params)
    },
    [language]
  )

  const messages = getTranslations(language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, messages }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access language context in Client Components
 *
 * @example
 * const { language, t, messages } = useLanguage()
 * // Dot-notation: t("blog.search")
 * // Direct access: messages.blog.search
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

// Re-export types for convenience
export type { Language }
