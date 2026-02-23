import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/site-config"
import type { Post } from "@/lib/supabase"

/**
 * Next.js built-in sitemap generator
 * Auto-generates /sitemap.xml with all published posts + static pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch all published posts
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const posts = (data || []) as Post[]

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ]

  // Dynamic blog post pages
  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at!),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...postPages]
}
