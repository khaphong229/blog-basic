import { supabase } from "@/lib/supabase"
import type { Post, PostInsert, PostUpdate, PostWithTags, Language, Tag } from "@/lib/supabase"

/**
 * Get all published posts by language
 */
export async function getPublishedPosts(language: Language): Promise<PostWithTags[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

  if (error) throw error
  if (!posts || posts.length === 0) return []

  const postsWithTags = await Promise.all(
    (posts as Post[]).map(async (post) => {
      const tags = await getPostTags(post.id)
      return { ...post, tags } as PostWithTags
    })
  )

  return postsWithTags
}

/**
 * Get a single post by slug and language
 */
export async function getPostBySlug(
  slug: string,
  language: Language
): Promise<PostWithTags | null> {
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
  const tags = await getPostTags(typedPost.id)
  return { ...typedPost, tags } as PostWithTags
}

/**
 * Get tags for a post
 */
export async function getPostTags(postId: string): Promise<Tag[]> {
  const { data, error } = await supabase.from("post_tags").select("tag_id").eq("post_id", postId)

  if (error) throw error
  if (!data || data.length === 0) return []

  const tagIds = (data as { tag_id: string }[]).map((pt) => pt.tag_id)

  const { data: tags, error: tagsError } = await supabase.from("tags").select("*").in("id", tagIds)

  if (tagsError) throw tagsError
  return (tags as Tag[]) || []
}

/**
 * Get all posts (for admin)
 */
export async function getAllPosts(language?: Language): Promise<PostWithTags[]> {
  let query = supabase.from("posts").select("*").order("created_at", { ascending: false })

  if (language) {
    query = query.eq("language", language)
  }

  const { data: posts, error } = await query

  if (error) throw error
  if (!posts || posts.length === 0) return []

  const postsWithTags = await Promise.all(
    (posts as Post[]).map(async (post) => {
      const tags = await getPostTags(post.id)
      return { ...post, tags } as PostWithTags
    })
  )

  return postsWithTags
}

/**
 * Create a new post
 */
export async function createPost(post: PostInsert, tagIds: string[]): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert(post as never)
    .select()
    .single()

  if (error) throw error

  const newPost = data as Post

  if (tagIds.length > 0) {
    const postTagsData = tagIds.map((tagId) => ({
      post_id: newPost.id,
      tag_id: tagId,
    }))
    await supabase.from("post_tags").insert(postTagsData as never)
  }

  return newPost
}

/**
 * Update a post
 */
export async function updatePost(
  id: string,
  updates: PostUpdate,
  tagIds?: string[]
): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  if (tagIds !== undefined) {
    await supabase.from("post_tags").delete().eq("post_id", id)

    if (tagIds.length > 0) {
      const postTagsData = tagIds.map((tagId) => ({
        post_id: id,
        tag_id: tagId,
      }))
      await supabase.from("post_tags").insert(postTagsData as never)
    }
  }

  return data as Post
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw error
}

/**
 * Increment view count
 */
export async function incrementViewCount(postId: string): Promise<void> {
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", postId)
    .single()

  if (fetchError) throw fetchError

  const currentCount = (post as { view_count: number })?.view_count || 0

  const { error } = await supabase
    .from("posts")
    .update({ view_count: currentCount + 1 } as never)
    .eq("id", postId)

  if (error) throw error
}

/**
 * Search posts by title/excerpt
 */
export async function searchPosts(query: string, language: Language): Promise<PostWithTags[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("published_at", { ascending: false })

  if (error) throw error
  if (!posts || posts.length === 0) return []

  const postsWithTags = await Promise.all(
    (posts as Post[]).map(async (post) => {
      const tags = await getPostTags(post.id)
      return { ...post, tags } as PostWithTags
    })
  )

  return postsWithTags
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tagSlug: string, language: Language): Promise<PostWithTags[]> {
  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .select("id")
    .eq("slug", tagSlug)
    .single()

  if (tagError) {
    if (tagError.code === "PGRST116") return []
    throw tagError
  }

  const typedTag = tag as { id: string }

  const { data: postTags, error: ptError } = await supabase
    .from("post_tags")
    .select("post_id")
    .eq("tag_id", typedTag.id)

  if (ptError) throw ptError
  if (!postTags || postTags.length === 0) return []

  const postIds = (postTags as { post_id: string }[]).map((pt) => pt.post_id)

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .in("id", postIds)
    .eq("language", language)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })

  if (postsError) throw postsError
  if (!posts || posts.length === 0) return []

  const postsWithTags = await Promise.all(
    (posts as Post[]).map(async (post) => {
      const tags = await getPostTags(post.id)
      return { ...post, tags } as PostWithTags
    })
  )

  return postsWithTags
}
