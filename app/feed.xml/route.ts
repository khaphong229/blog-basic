import { createClient } from "@/lib/supabase/server"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config"
import type { Post } from "@/lib/supabase"

/**
 * RSS 2.0 feed handler
 * GET /feed.xml — returns XML feed of all published posts
 */
export async function GET() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50)

  const posts = (data || []) as Post[]

  const items = (posts || [])
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ""}]]></description>
      <author>${post.author}</author>
      <pubDate>${new Date(post.published_at!).toUTCString()}</pubDate>
      <category>${post.language === "en" ? "English" : "Vietnamese"}</category>
    </item>`
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
