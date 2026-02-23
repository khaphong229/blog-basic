import { describe, it, expect } from "vitest"
import { translate, getTranslations } from "@/lib/i18n"

describe("i18n utilities", () => {
  describe("translate", () => {
    it("returns English translation for dot-notation key", () => {
      expect(translate("en", "nav.home")).toBe("Home")
    })

    it("returns Vietnamese translation for dot-notation key", () => {
      expect(translate("vi", "nav.home")).toBe("Trang chủ")
    })

    it("returns the key itself for missing translation", () => {
      expect(translate("en", "nonexistent.key")).toBe("nonexistent.key")
    })

    it("handles nested keys correctly", () => {
      expect(translate("en", "home.title")).toBe("Welcome to Our Blog")
    })

    it("returns different results for different languages", () => {
      expect(translate("en", "home.title")).not.toBe(translate("vi", "home.title"))
    })

    it("replaces template params", () => {
      const result = translate("en", "blog.showingArticles", { count: "5" })
      expect(result).toContain("5")
    })
  })

  describe("getTranslations", () => {
    it("returns a messages object for English", () => {
      const messages = getTranslations("en")
      expect(messages.nav.home).toBe("Home")
    })

    it("returns a messages object for Vietnamese", () => {
      const messages = getTranslations("vi")
      expect(messages.nav.home).toBe("Trang chủ")
    })
  })
})
