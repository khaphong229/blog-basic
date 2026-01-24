import { supabase } from "@/lib/supabase"
import type { Tag, TagInsert, TagUpdate, Language } from "@/lib/supabase"

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from("tags").select("*").order("slug", { ascending: true })

  if (error) throw error
  return (data as Tag[]) || []
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const { data, error } = await supabase.from("tags").select("*").eq("slug", slug).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as Tag
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string): Promise<Tag | null> {
  const { data, error } = await supabase.from("tags").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as Tag
}

/**
 * Create a new tag
 */
export async function createTag(tag: TagInsert): Promise<Tag> {
  const { data, error } = await supabase
    .from("tags")
    .insert(tag as never)
    .select()
    .single()

  if (error) throw error
  return data as Tag
}

/**
 * Update a tag
 */
export async function updateTag(id: string, updates: TagUpdate): Promise<Tag> {
  const { data, error } = await supabase
    .from("tags")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Tag
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase.from("tags").delete().eq("id", id)
  if (error) throw error
}

/**
 * Get or create tag by name
 */
export async function getOrCreateTag(slug: string, nameVi: string, nameEn: string): Promise<Tag> {
  const existing = await getTagBySlug(slug)
  if (existing) return existing

  return createTag({
    slug,
    name_vi: nameVi,
    name_en: nameEn,
  })
}

/**
 * Get tags used by posts in a specific language
 */
export async function getTagsWithPostCount(
  language: Language
): Promise<(Tag & { post_count: number })[]> {
  // Get all published posts for this language
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())

  if (postsError) throw postsError
  if (!posts || posts.length === 0) return []

  const postIds = (posts as { id: string }[]).map((p) => p.id)

  // Get all post_tags for these posts
  const { data: postTags, error: ptError } = await supabase
    .from("post_tags")
    .select("tag_id")
    .in("post_id", postIds)

  if (ptError) throw ptError
  if (!postTags || postTags.length === 0) return []

  // Count tags
  const tagCounts = new Map<string, number>()
  for (const pt of postTags as { tag_id: string }[]) {
    tagCounts.set(pt.tag_id, (tagCounts.get(pt.tag_id) || 0) + 1)
  }

  // Get tag details
  const tagIds = Array.from(tagCounts.keys())
  const { data: tags, error: tagsError } = await supabase.from("tags").select("*").in("id", tagIds)

  if (tagsError) throw tagsError
  if (!tags) return []

  return (tags as Tag[])
    .map((tag) => ({
      ...tag,
      post_count: tagCounts.get(tag.id) || 0,
    }))
    .sort((a, b) => b.post_count - a.post_count)
}
