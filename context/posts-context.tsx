"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Post, PostWithTags, Tag } from "@/lib/supabase"
import { translatePost } from "@/lib/api/translation"
import type { BlogPost, Comment } from "@/types/blog"

// ===========================================
// Helper Functions
// ===========================================

/** Convert title to URL-friendly slug */
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

/** Generate random 6-char short code */
const generateShortCode = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/** Map Supabase Post to BlogPost interface */
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
        shortUrl: "",
        tags: post.tags?.map((t) => t.slug) || [],
        status: post.status as "draft" | "published",
        publishedAt: post.published_at ? new Date(post.published_at) : null,
        viewCount: post.view_count,
        seoTitle: post.seo_title,
        seoDescription: post.seo_description,
        featuredImage: post.featured_image,
        linkedPostId: post.linked_post_id,
        tiktokCode: post.tiktok_code,
    }
}

// ===========================================
// Context Type
// ===========================================

interface PostsContextType {
    posts: BlogPost[]
    isLoading: boolean
    error: string | null
    addPost: (
        post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl" | "linkedPostId">
    ) => Promise<void>
    updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>
    deletePost: (id: string) => Promise<void>
    getPostBySlug: (slug: string) => BlogPost | undefined
    getPostsByLanguage: (language: "en" | "vi") => BlogPost[]
    searchPosts: (query: string, language: "en" | "vi") => BlogPost[]
    getPostsByTag: (tag: string, language: "en" | "vi") => BlogPost[]
    getAllTags: (language: "en" | "vi") => string[]
    addComment: (postId: string, comment: Omit<Comment, "id" | "createdAt">) => Promise<void>
    refreshPosts: () => Promise<void>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

// ===========================================
// Provider
// ===========================================

export function PostsProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch all posts with tags and comments (batch, N+1 fixed)
    const fetchPosts = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false })

            if (postsError) throw postsError
            if (!postsData || postsData.length === 0) {
                setPosts([])
                return
            }

            const postIds = (postsData as Post[]).map((p) => p.id)

            // Batch: tags
            const { data: postTagsData } = await supabase
                .from("post_tags")
                .select("post_id, tag_id")
                .in("post_id", postIds)

            const { data: tagsData } = await supabase.from("tags").select("*")

            const tagMap = new Map<string, Tag>()
            if (tagsData) {
                for (const tag of tagsData as Tag[]) tagMap.set(tag.id, tag)
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

            // Batch: comments
            const { data: commentsData } = await supabase
                .from("comments")
                .select("*")
                .in("post_id", postIds)
                .eq("status", "visible")
                .order("created_at", { ascending: true })

            const commentsMap = new Map<string, Comment[]>()
            if (commentsData) {
                for (const c of commentsData as {
                    id: string; post_id: string; author_name: string;
                    author_email: string; content: string; created_at: string
                }[]) {
                    const comment: Comment = {
                        id: c.id, name: c.author_name, email: c.author_email,
                        content: c.content, createdAt: new Date(c.created_at),
                    }
                    const existing = commentsMap.get(c.post_id) || []
                    existing.push(comment)
                    commentsMap.set(c.post_id, existing)
                }
            }

            const mappedPosts = (postsData as Post[]).map((post) => {
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

    useEffect(() => { fetchPosts() }, [fetchPosts])

    // Helper: create/link tags for a post
    const handleTags = async (postId: string, tagSlugs: string[]) => {
        const supabase = createClient()
        for (const tagSlug of tagSlugs) {
            let { data: existingTag } = await supabase
                .from("tags").select("id").eq("slug", tagSlug).single()
            if (!existingTag) {
                const { data: newTag } = await supabase
                    .from("tags")
                    .insert({ slug: tagSlug, name_vi: tagSlug, name_en: tagSlug } as never)
                    .select("id").single()
                existingTag = newTag
            }
            if (existingTag) {
                await supabase.from("post_tags").insert({
                    post_id: postId, tag_id: (existingTag as { id: string }).id,
                } as never)
            }
        }
    }

    // CRUD: Add post (with auto-translation for VI)
    const addPost = async (
        post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl" | "linkedPostId">
    ) => {
        try {
            const slug = generateSlug(post.title)
            const now = new Date().toISOString()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let translationResult: any = null

            if (post.language === "vi") {
                try {
                    translationResult = await translatePost({
                        title: post.title, excerpt: post.excerpt,
                        content: post.content, tags: post.tags,
                    })
                } catch (error) {
                    console.error("Translation failed:", error)
                    throw new Error("Không thể dịch bài viết sang tiếng Anh. Vui lòng thử lại.")
                }
            }

            const supabase = createClient()
            const { data: newPost, error: insertError } = await supabase
                .from("posts")
                .insert({
                    language: post.language, title: post.title, slug,
                    excerpt: post.excerpt || null, content: post.content, author: post.author,
                    featured_image: post.featuredImage || null,
                    status: post.status || "draft",
                    published_at: post.status === "published" ? now : null,
                    seo_title: post.seoTitle || null, seo_description: post.seoDescription || null,
                } as never)
                .select().single()

            if (insertError) throw insertError
            const newPostId = (newPost as { id: string }).id

            // Create EN translation if VI post
            if (post.language === "vi" && translationResult) {
                const enSlug = generateSlug(translationResult.translatedTitle)
                const { data: enPost, error: enInsertError } = await supabase
                    .from("posts")
                    .insert({
                        language: "en", title: translationResult.translatedTitle, slug: enSlug,
                        excerpt: translationResult.translatedExcerpt || null,
                        content: translationResult.translatedContent, author: post.author,
                        featured_image: post.featuredImage || null,
                        status: post.status || "draft",
                        published_at: post.status === "published" ? now : null,
                        linked_post_id: newPostId,
                    } as never)
                    .select().single()

                if (enInsertError) {
                    await supabase.from("posts").delete().eq("id", newPostId)
                    throw enInsertError
                }

                const enPostId = (enPost as { id: string }).id
                await supabase.from("posts").update({ linked_post_id: enPostId } as never).eq("id", newPostId)

                // Copy tiktok_code from VI post to EN post (shared code)
                const viTiktokCode = (newPost as { tiktok_code: number | null }).tiktok_code
                if (viTiktokCode) {
                    await supabase.from("posts").update({ tiktok_code: viTiktokCode } as never).eq("id", enPostId)
                }

                if (translationResult.translatedTags?.length > 0) {
                    await handleTags(enPostId, translationResult.translatedTags)
                }
            }

            if (post.tags?.length > 0) await handleTags(newPostId, post.tags)

            // Short URL
            const shortCode = generateShortCode()
            await supabase.from("shortened_urls").insert({
                original_url: `/blog/${slug}`, short_url: `/s/${shortCode}`,
                short_code: shortCode, language: post.language, post_id: newPostId,
            } as never)

            await fetchPosts()
        } catch (err) {
            console.error("Error adding post:", err)
            throw err
        }
    }

    // CRUD: Update post (with auto-sync translation)
    const updatePost = async (id: string, updates: Partial<BlogPost>) => {
        try {
            const supabase = createClient()
            const updateData: Record<string, unknown> = {}
            const currentPost = posts.find(p => p.id === id)
            const isViPost = currentPost?.language === "vi"
            const hasLinkedPost = !!currentPost?.linkedPostId

            if (updates.title !== undefined) updateData.title = updates.title
            if (updates.content !== undefined) updateData.content = updates.content
            if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt
            if (updates.author !== undefined) updateData.author = updates.author
            if (updates.language !== undefined) updateData.language = updates.language
            if (updates.status !== undefined) {
                updateData.status = updates.status
                if (updates.status === "published") updateData.published_at = new Date().toISOString()
            }
            if (updates.seoTitle !== undefined) updateData.seo_title = updates.seoTitle
            if (updates.seoDescription !== undefined) updateData.seo_description = updates.seoDescription
            if (updates.featuredImage !== undefined) updateData.featured_image = updates.featuredImage
            if (updates.linkedPostId !== undefined) updateData.linked_post_id = updates.linkedPostId

            if (isViPost && hasLinkedPost && currentPost) {
                try {
                    const translation = await translatePost({
                        title: updates.title || currentPost.title,
                        excerpt: updates.excerpt || currentPost.excerpt,
                        content: updates.content || currentPost.content,
                        tags: updates.tags || currentPost.tags,
                    })
                    if (currentPost.linkedPostId) {
                        await supabase.from("posts").update({
                            title: translation.translatedTitle,
                            excerpt: translation.translatedExcerpt,
                            content: translation.translatedContent,
                        } as never).eq("id", currentPost.linkedPostId)

                        await supabase.from("post_tags").delete().eq("post_id", currentPost.linkedPostId)
                        if (translation.translatedTags?.length > 0) {
                            await handleTags(currentPost.linkedPostId, translation.translatedTags)
                        }
                    }
                } catch (error) {
                    console.error("Auto-translation for update failed:", error)
                    throw new Error("Không thể cập nhật bản dịch tiếng Anh. Vui lòng thử lại.")
                }
            }

            if (Object.keys(updateData).length > 0) {
                const { error: updateError } = await supabase
                    .from("posts").update(updateData as never).eq("id", id)
                if (updateError) throw updateError
            }

            if (updates.tags !== undefined) {
                await supabase.from("post_tags").delete().eq("post_id", id)
                await handleTags(id, updates.tags)
            }

            await fetchPosts()
        } catch (err) {
            console.error("Error updating post:", err)
            throw err
        }
    }

    // CRUD: Delete post
    const deletePost = async (id: string) => {
        try {
            const supabase = createClient()
            const { error: deleteError } = await supabase.from("posts").delete().eq("id", id)
            if (deleteError) throw deleteError
            setPosts((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            console.error("Error deleting post:", err)
            throw err
        }
    }

    // Query: local filtering
    const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug)

    const getPostsByLanguage = (language: "en" | "vi") =>
        posts.filter((p) => p.language === language)

    const searchPosts = (query: string, language: "en" | "vi") => {
        const q = query.toLowerCase()
        return posts.filter(
            (p) => p.language === language && p.status === "published" &&
                (p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
        )
    }

    const getPostsByTag = (tag: string, language: "en" | "vi") =>
        posts.filter((p) => p.language === language && p.status === "published" &&
            p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))

    const getAllTags = (language: "en" | "vi") => {
        const tags = new Set<string>()
        posts.filter((p) => p.language === language && p.status === "published")
            .forEach((p) => p.tags.forEach((tag) => tags.add(tag)))
        return Array.from(tags).sort()
    }

    // Add comment to a post
    const addComment = async (postId: string, comment: Omit<Comment, "id" | "createdAt">) => {
        try {
            const supabase = createClient()
            const { error: insertError } = await supabase.from("comments").insert({
                post_id: postId,
                author_name: comment.name,
                author_email: comment.email,
                content: comment.content,
                status: "visible",
            } as never)
            if (insertError) throw insertError
            await fetchPosts()
        } catch (err) {
            console.error("Error adding comment:", err)
            throw err
        }
    }

    const refreshPosts = async () => { await fetchPosts() }

    return (
        <PostsContext.Provider value={{
            posts, isLoading, error, addPost, updatePost, deletePost,
            getPostBySlug, getPostsByLanguage, searchPosts, getPostsByTag,
            getAllTags, addComment, refreshPosts,
        }}>
            {children}
        </PostsContext.Provider>
    )
}

/** Hook for accessing posts context */
export function usePosts() {
    const context = useContext(PostsContext)
    if (!context) throw new Error("usePosts must be used within PostsProvider")
    return context
}
