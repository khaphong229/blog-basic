import { describe, it, expect } from "vitest"
import { generateBlogPostingLD, generateWebsiteLD } from "@/lib/structured-data"

describe("Structured Data", () => {
  describe("generateBlogPostingLD", () => {
    it("generates valid JSON-LD for a blog post", () => {
      const jsonLD = generateBlogPostingLD({
        title: "Test Post",
        excerpt: "A test post",
        author: "John Doe",
        slug: "test-post",
        publishedAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
        featuredImage: "https://example.com/image.jpg",
        language: "en",
      })

      const parsed = JSON.parse(jsonLD)
      expect(parsed["@context"]).toBe("https://schema.org")
      expect(parsed["@type"]).toBe("BlogPosting")
      expect(parsed.headline).toBe("Test Post")
      expect(parsed.author.name).toBe("John Doe")
      expect(parsed.datePublished).toBe("2024-01-01T00:00:00.000Z")
      expect(parsed.image).toBe("https://example.com/image.jpg")
      expect(parsed.inLanguage).toBe("en-US")
    })

    it("handles missing optional fields gracefully", () => {
      const jsonLD = generateBlogPostingLD({
        title: "Minimal Post",
        author: "Author",
        slug: "minimal",
      })

      const parsed = JSON.parse(jsonLD)
      expect(parsed.headline).toBe("Minimal Post")
      expect(parsed.datePublished).toBeUndefined()
      expect(parsed.image).toBeUndefined()
      expect(parsed.inLanguage).toBeUndefined()
    })

    it("maps Vietnamese language correctly", () => {
      const jsonLD = generateBlogPostingLD({
        title: "Bài viết",
        author: "Tác giả",
        slug: "bai-viet",
        language: "vi",
      })

      const parsed = JSON.parse(jsonLD)
      expect(parsed.inLanguage).toBe("vi-VN")
    })
  })

  describe("generateWebsiteLD", () => {
    it("generates valid WebSite schema", () => {
      const jsonLD = generateWebsiteLD()
      const parsed = JSON.parse(jsonLD)

      expect(parsed["@context"]).toBe("https://schema.org")
      expect(parsed["@type"]).toBe("WebSite")
      expect(parsed.name).toBeDefined()
      expect(parsed.potentialAction["@type"]).toBe("SearchAction")
    })
  })
})
