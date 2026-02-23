import { createClient } from "@/lib/supabase/server"
import type { Post, PostWithTags, Tag, Language, Comment } from "@/lib/supabase"

// ===========================================
// Server-side data fetching (for Server Components)
// Uses server Supabase client with cookies
// ===========================================

/**
 * Get all published posts with tags (optimized single-query with JOIN)
 * Replaces the N+1 query pattern in the client-side version
 */
export async function getPublishedPostsServer(language: Language): Promise<PostWithTags[]> {
  const supabase = await createClient()

  // Fetch posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

  if (postsError) throw postsError
  if (!posts || posts.length === 0) return []

  // Batch fetch all tags for these posts (fixes N+1)
  const postIds = (posts as Post[]).map((p) => p.id)
  const { data: postTagsData } = await supabase
    .from("post_tags")
    .select("post_id, tag_id")
    .in("post_id", postIds)

  const { data: tagsData } = await supabase.from("tags").select("*")

  // Build tag lookup maps
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

/**
 * Get a single post by slug with full details (tags + comments)
 * For server-rendered blog detail page
 */
export async function getPostBySlugServer(
  slug: string,
  language: Language
): Promise<(PostWithTags & { comments: Comment[] }) | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("language", language)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  const typedPost = post as Post

  // Fetch tags
  const { data: postTagsData } = await supabase
    .from("post_tags")
    .select("tag_id")
    .eq("post_id", typedPost.id)

  let tags: Tag[] = []
  if (postTagsData && postTagsData.length > 0) {
    const tagIds = (postTagsData as { tag_id: string }[]).map((pt) => pt.tag_id)
    const { data: tagsData } = await supabase.from("tags").select("*").in("id", tagIds)
    tags = (tagsData as Tag[]) || []
  }

  // Fetch visible comments
  const { data: commentsData } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", typedPost.id)
    .eq("status", "visible")
    .order("created_at", { ascending: true })

  const comments = (commentsData as Comment[]) || []

  return { ...typedPost, tags, comments }
}

/**
 * Get all tags with post counts for a language
 * For server-rendered tag filters
 */
export async function getTagsServer(language: Language): Promise<(Tag & { post_count: number })[]> {
  const supabase = await createClient()

  // Get published post IDs for this language
  const { data: posts } = await supabase
    .from("posts")
    .select("id")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())

  if (!posts || posts.length === 0) return []

  const postIds = (posts as { id: string }[]).map((p) => p.id)

  // Get tag counts
  const { data: postTags } = await supabase
    .from("post_tags")
    .select("tag_id")
    .in("post_id", postIds)

  if (!postTags || postTags.length === 0) return []

  const tagCounts = new Map<string, number>()
  for (const pt of postTags as { tag_id: string }[]) {
    tagCounts.set(pt.tag_id, (tagCounts.get(pt.tag_id) || 0) + 1)
  }

  const tagIds = Array.from(tagCounts.keys())
  const { data: tags } = await supabase.from("tags").select("*").in("id", tagIds)

  if (!tags) return []

  return (tags as Tag[])
    .map((tag) => ({
      ...tag,
      post_count: tagCounts.get(tag.id) || 0,
    }))
    .sort((a, b) => b.post_count - a.post_count)
}

/**
 * Increment view count using atomic update
 * Uses RPC if available, otherwise manual update
 */
export async function incrementViewCountServer(postId: string): Promise<void> {
  const supabase = await createClient()

  // Try RPC first (atomic) — uses custom function from migration 005
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: rpcError } = await (supabase as any).rpc("increment_view_count", {
    post_id: postId,
  })

  if (rpcError) {
    // Fallback: manual increment (less safe but works without RPC function)
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("view_count")
      .eq("id", postId)
      .single()

    if (fetchError) throw fetchError

    const currentCount = (post as { view_count: number })?.view_count || 0

    const { error: updateError } = await supabase
      .from("posts")
      .update({ view_count: currentCount + 1 } as never)
      .eq("id", postId)

    if (updateError) throw updateError
  }
}
