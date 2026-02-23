import { createClient } from "@/lib/supabase/server"
import type { Post, PostWithTags, Tag, Language } from "@/lib/supabase"

// ===========================================
// Server-side data fetching for /tiktok page
// ===========================================

/**
 * Find a published post by its tiktok_code for a given language.
 * Returns the slug for client-side redirect, or null if not found.
 */
export async function getPostByTiktokCode(
  code: number,
  language: Language
): Promise<{ slug: string; title: string } | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("slug, title")
    .eq("tiktok_code", code)
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single()

  if (error) {
    if (error.code === "PGRST116") return null // Not found
    throw error
  }

  return post as { slug: string; title: string }
}

/**
 * Get recent published posts for the TikTok landing page grid.
 * Returns posts with tags and tiktok_code for display.
 */
export async function getRecentPostsForTiktok(
  language: Language,
  limit: number = 12
): Promise<(PostWithTags & { tiktok_code: number | null })[]> {
  const supabase = await createClient()

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit)

  if (postsError) throw postsError
  if (!posts || posts.length === 0) return []

  // Batch fetch tags (same pattern as posts.server.ts)
  const postIds = (posts as Post[]).map((p) => p.id)
  const { data: postTagsData } = await supabase
    .from("post_tags")
    .select("post_id, tag_id")
    .in("post_id", postIds)

  const { data: tagsData } = await supabase.from("tags").select("*")

  const tagMap = new Map<string, Tag>()
  if (tagsData) {
    for (const tag of tagsData as Tag[]) {
      tagMap.set(tag.id, tag)
    }
  }

  const postTagsMap = new Map<string, Tag[]>()
  if (postTagsData) {
    for (const pt of postTagsData as { post_id: string; tag_id: string }[]) {
      const tag = tagMap.get(pt.tag_id)
      if (tag) {
        const existing = postTagsMap.get(pt.post_id) || []
        existing.push(tag)
        postTagsMap.set(pt.post_id, existing)
      }
    }
  }

  return (posts as Post[]).map((post) => ({
    ...post,
    tags: postTagsMap.get(post.id) || [],
  }))
}
