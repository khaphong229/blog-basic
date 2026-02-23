/**
 * Shared types for the blog application
 * Extracted from blog-context.tsx for reuse across contexts
 */

export interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  createdAt: Date
  updatedAt: Date
  language: "en" | "vi"
  slug: string
  comments: Comment[]
  shortUrl: string
  tags: string[]
  /** Post status: draft or published */
  status?: "draft" | "published"
  /** Date post was published */
  publishedAt?: Date | null
  /** Number of views */
  viewCount?: number
  /** SEO-optimized title override */
  seoTitle?: string | null
  /** SEO meta description override */
  seoDescription?: string | null
  /** Featured image URL */
  featuredImage?: string | null
  /** ID of linked translated post */
  linkedPostId?: string | null
  /** TikTok video reference code (shared between VI/EN linked posts) */
  tiktokCode?: number | null
}

export interface URLShortenerConfig {
  provider: string
  endpoint: string
  apiKey: string
  httpMethod: "GET" | "POST" | "PUT"
  bodyFormat: string
  active: boolean
}

export interface URLLog {
  id: string
  timestamp: Date
  originalUrl: string
  shortenedUrl: string
  language: "en" | "vi"
  status: "success" | "failed"
  message?: string
}
