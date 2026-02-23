import en from "@/messages/en.json"
import vi from "@/messages/vi.json"

export type Language = "en" | "vi"

/** Type representing the nested translation structure */
export type Messages = typeof en

/** All available translations, keyed by language */
const messages: Record<Language, Messages> = { en, vi }

/**
 * Get translations for a given language (Server Components)
 * Returns the full messages object for the requested language
 *
 * @example
 * // In a Server Component
 * const t = getTranslations("en")
 * console.log(t.blog.search) // "Search posts..."
 */
export function getTranslations(lang: Language): Messages {
  return messages[lang] || messages.en
}

/**
 * Get a translation by dot-notation key (Client Components)
 * Supports nested keys like "blog.search" or "home.hero.heading"
 *
 * @example
 * translate("en", "blog.search") // "Search posts..."
 * translate("vi", "home.hero.heading") // "Suy nghĩ, Câu chuyện & Ý tưởng."
 * translate("en", "blog.showingArticles", { count: "5" }) // "Showing 5 articles"
 */
export function translate(
  lang: Language,
  key: string,
  params?: Record<string, string>
): string {
  const keys = key.split(".")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = messages[lang] || messages.en

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k]
    } else {
      return key // Return key if not found (for debugging)
    }
  }

  if (typeof result !== "string") return key

  // Replace template params like {count}
  if (params) {
    let final = result
    for (const [paramKey, paramValue] of Object.entries(params)) {
      final = final.replace(`{${paramKey}}`, paramValue)
    }
    return final
  }

  return result
}
