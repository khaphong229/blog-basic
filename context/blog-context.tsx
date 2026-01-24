"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Post, PostWithTags, Tag, Language } from "@/lib/supabase"

// ===========================================
// Types (giữ nguyên interface cũ để không break UI)
// ===========================================

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
  // New fields from Supabase
  status?: "draft" | "published"
  publishedAt?: Date | null
  viewCount?: number
  seoTitle?: string | null
  seoDescription?: string | null
  featuredImage?: string | null
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

interface BlogContextType {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  addPost: (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl">
  ) => Promise<void>
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  getPostBySlug: (slug: string) => BlogPost | undefined
  addComment: (postId: string, comment: Omit<Comment, "id" | "createdAt">) => Promise<void>
  getPostsByLanguage: (language: "en" | "vi") => BlogPost[]
  searchPosts: (query: string, language: "en" | "vi") => BlogPost[]
  getPostsByTag: (tag: string, language: "en" | "vi") => BlogPost[]
  getAllTags: (language: "en" | "vi") => string[]
  refreshPosts: () => Promise<void>
  urlConfigs: { en: URLShortenerConfig | null; vi: URLShortenerConfig | null }
  updateUrlConfig: (language: "en" | "vi", config: URLShortenerConfig) => void
  urlLogs: URLLog[]
  addUrlLog: (log: Omit<URLLog, "id" | "timestamp">) => void
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

// ===========================================
// Helper Functions
// ===========================================

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

const generateShortCode = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Convert Supabase Post to BlogPost interface
 */
function mapSupabasePostToBlogPost(post: PostWithTags, comments: Comment[] = []): BlogPost {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    author: post.author,
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
    language: post.language as "en" | "vi",
    slug: post.slug,
    comments,
    shortUrl: "", // Will be fetched separately if needed
    tags: post.tags?.map((t) => t.slug) || [],
    status: post.status as "draft" | "published",
    publishedAt: post.published_at ? new Date(post.published_at) : null,
    viewCount: post.view_count,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    featuredImage: post.featured_image,
  }
}

// ===========================================
// Provider Component
// ===========================================

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [urlConfigs, setUrlConfigs] = useState<{
    en: URLShortenerConfig | null
    vi: URLShortenerConfig | null
  }>({
    en: null,
    vi: null,
  })
  const [urlLogs, setUrlLogs] = useState<URLLog[]>([])

  // ===========================================
  // Fetch Posts from Supabase
  // ===========================================

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch all posts (for admin, we want all; for public, filter by status)
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (postsError) throw postsError

      if (!postsData || postsData.length === 0) {
        setPosts([])
        return
      }

      // Fetch tags for all posts
      const postIds = (postsData as Post[]).map((p) => p.id)
      const { data: postTagsData } = await supabase
        .from("post_tags")
        .select("post_id, tag_id")
        .in("post_id", postIds)

      // Fetch all tags
      const { data: tagsData } = await supabase.from("tags").select("*")

      // Create tag map
      const tagMap = new Map<string, Tag>()
      if (tagsData) {
        for (const tag of tagsData as Tag[]) {
          tagMap.set(tag.id, tag)
        }
      }

      // Create post-tags map
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

      // Fetch comments for all posts
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .in("post_id", postIds)
        .eq("status", "visible")
        .order("created_at", { ascending: true })

      // Create comments map
      const commentsMap = new Map<string, Comment[]>()
      if (commentsData) {
        for (const c of commentsData as {
          id: string
          post_id: string
          author_name: string
          author_email: string
          content: string
          created_at: string
        }[]) {
          const comment: Comment = {
            id: c.id,
            name: c.author_name,
            email: c.author_email,
            content: c.content,
            createdAt: new Date(c.created_at),
          }
          const existing = commentsMap.get(c.post_id) || []
          existing.push(comment)
          commentsMap.set(c.post_id, existing)
        }
      }

      // Map posts with tags and comments
      const mappedPosts: BlogPost[] = (postsData as Post[]).map((post) => {
        const tags = postTagsMap.get(post.id) || []
        const comments = commentsMap.get(post.id) || []
        return mapSupabasePostToBlogPost({ ...post, tags }, comments)
      })

      setPosts(mappedPosts)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // ===========================================
  // CRUD Operations
  // ===========================================

  const addPost = async (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl">
  ) => {
    try {
      const slug = generateSlug(post.title)
      const now = new Date().toISOString()

      // Insert post
      const { data: newPost, error: insertError } = await supabase
        .from("posts")
        .insert({
          language: post.language,
          title: post.title,
          slug,
          excerpt: post.excerpt || null,
          content: post.content,
          author: post.author,
          featured_image: post.featuredImage || null,
          status: post.status || "draft",
          published_at: post.status === "published" ? now : null,
          seo_title: post.seoTitle || null,
          seo_description: post.seoDescription || null,
        } as never)
        .select()
        .single()

      if (insertError) throw insertError

      // Handle tags - create if not exist, then link
      if (post.tags && post.tags.length > 0) {
        for (const tagSlug of post.tags) {
          // Get or create tag
          let { data: existingTag } = await supabase
            .from("tags")
            .select("id")
            .eq("slug", tagSlug)
            .single()

          if (!existingTag) {
            const { data: newTag } = await supabase
              .from("tags")
              .insert({
                slug: tagSlug,
                name_vi: tagSlug,
                name_en: tagSlug,
              } as never)
              .select("id")
              .single()
            existingTag = newTag
          }

          if (existingTag) {
            await supabase.from("post_tags").insert({
              post_id: (newPost as { id: string }).id,
              tag_id: (existingTag as { id: string }).id,
            } as never)
          }
        }
      }

      // Create short URL
      const shortCode = generateShortCode()
      await supabase.from("shortened_urls").insert({
        original_url: `/blog/${slug}`,
        short_url: `/s/${shortCode}`,
        short_code: shortCode,
        language: post.language,
        post_id: (newPost as { id: string }).id,
      } as never)

      // Refresh posts
      await fetchPosts()
    } catch (err) {
      console.error("Error adding post:", err)
      throw err
    }
  }

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const updateData: Record<string, unknown> = {}

      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt
      if (updates.author !== undefined) updateData.author = updates.author
      if (updates.language !== undefined) updateData.language = updates.language
      if (updates.status !== undefined) {
        updateData.status = updates.status
        if (updates.status === "published") {
          updateData.published_at = new Date().toISOString()
        }
      }
      if (updates.seoTitle !== undefined) updateData.seo_title = updates.seoTitle
      if (updates.seoDescription !== undefined) updateData.seo_description = updates.seoDescription
      if (updates.featuredImage !== undefined) updateData.featured_image = updates.featuredImage

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("posts")
          .update(updateData as never)
          .eq("id", id)

        if (updateError) throw updateError
      }

      // Handle tags update
      if (updates.tags !== undefined) {
        // Remove existing tags
        await supabase.from("post_tags").delete().eq("post_id", id)

        // Add new tags
        for (const tagSlug of updates.tags) {
          let { data: existingTag } = await supabase
            .from("tags")
            .select("id")
            .eq("slug", tagSlug)
            .single()

          if (!existingTag) {
            const { data: newTag } = await supabase
              .from("tags")
              .insert({
                slug: tagSlug,
                name_vi: tagSlug,
                name_en: tagSlug,
              } as never)
              .select("id")
              .single()
            existingTag = newTag
          }

          if (existingTag) {
            await supabase.from("post_tags").insert({
              post_id: id,
              tag_id: (existingTag as { id: string }).id,
            } as never)
          }
        }
      }

      // Refresh posts
      await fetchPosts()
    } catch (err) {
      console.error("Error updating post:", err)
      throw err
    }
  }

  const deletePost = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from("posts").delete().eq("id", id)

      if (deleteError) throw deleteError

      // Update local state immediately
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting post:", err)
      throw err
    }
  }

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "createdAt">) => {
    try {
      const { error: insertError } = await supabase.from("comments").insert({
        post_id: postId,
        author_name: comment.name,
        author_email: comment.email,
        content: comment.content,
        status: "visible",
      } as never)

      if (insertError) throw insertError

      // Refresh posts to get updated comments
      await fetchPosts()
    } catch (err) {
      console.error("Error adding comment:", err)
      throw err
    }
  }

  // ===========================================
  // Query Functions (Local filtering for performance)
  // ===========================================

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug)
  }

  const getPostsByLanguage = (language: "en" | "vi") => {
    return posts.filter((post) => post.language === language)
  }

  const searchPosts = (query: string, language: "en" | "vi") => {
    const lowercaseQuery = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.language === language &&
        post.status === "published" &&
        (post.title.toLowerCase().includes(lowercaseQuery) ||
          post.excerpt.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getPostsByTag = (tag: string, language: "en" | "vi") => {
    return posts.filter(
      (post) =>
        post.language === language &&
        post.status === "published" &&
        post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  }

  const getAllTags = (language: "en" | "vi") => {
    const tags = new Set<string>()
    posts
      .filter((post) => post.language === language && post.status === "published")
      .forEach((post) => {
        post.tags.forEach((tag) => tags.add(tag))
      })
    return Array.from(tags).sort()
  }

  const refreshPosts = async () => {
    await fetchPosts()
  }

  // ===========================================
  // URL Shortener (kept as local state for now)
  // ===========================================

  const updateUrlConfig = (language: "en" | "vi", config: URLShortenerConfig) => {
    setUrlConfigs((prev) => ({
      ...prev,
      [language]: config,
    }))
  }

  const addUrlLog = (log: Omit<URLLog, "id" | "timestamp">) => {
    const newLog: URLLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setUrlLogs((prev) => [newLog, ...prev])
  }

  // ===========================================
  // Provider Return
  // ===========================================

  return (
    <BlogContext.Provider
      value={{
        posts,
        isLoading,
        error,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        addComment,
        getPostsByLanguage,
        searchPosts,
        getPostsByTag,
        getAllTags,
        refreshPosts,
        urlConfigs,
        updateUrlConfig,
        urlLogs,
        addUrlLog,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error("useBlog must be used within BlogProvider")
  }
  return context
}
