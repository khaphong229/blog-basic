"use client"

/**
 * BlogContext Facade
 *
 * This file is kept as a backward-compatible re-export layer.
 * All components that import from "@/context/blog-context" will continue to work.
 *
 * Internal implementation is split into:
 * - PostsContext (posts-context.tsx) — Posts CRUD, search, filter
 * - UrlShortenerContext (url-shortener-context.tsx) — URL shortener config/logs
 * - Types (types/blog.ts) — Shared types
 */

import type { ReactNode } from "react"
import { PostsProvider, usePosts } from "./posts-context"
import { UrlShortenerProvider, useUrlShortener } from "./url-shortener-context"

// Re-export types so consumers don't need to change imports
export type { BlogPost, Comment, URLShortenerConfig, URLLog } from "@/types/blog"

/**
 * Composed BlogProvider — wraps both PostsProvider and UrlShortenerProvider
 * Used in layout.tsx, keeps backward compatibility
 */
export function BlogProvider({ children }: { children: ReactNode }) {
  return (
    <PostsProvider>
      <UrlShortenerProvider>
        {children}
      </UrlShortenerProvider>
    </PostsProvider>
  )
}

/**
 * Backward-compatible hook — merges PostsContext + UrlShortenerContext
 * Components using `const { searchPosts, urlConfigs } = useBlog()` still work
 */
export function useBlog() {
  const postsCtx = usePosts()
  const urlCtx = useUrlShortener()

  return {
    // Posts
    posts: postsCtx.posts,
    isLoading: postsCtx.isLoading,
    error: postsCtx.error,
    addPost: postsCtx.addPost,
    updatePost: postsCtx.updatePost,
    deletePost: postsCtx.deletePost,
    getPostBySlug: postsCtx.getPostBySlug,
    getPostsByLanguage: postsCtx.getPostsByLanguage,
    searchPosts: postsCtx.searchPosts,
    getPostsByTag: postsCtx.getPostsByTag,
    getAllTags: postsCtx.getAllTags,
    refreshPosts: postsCtx.refreshPosts,
    addComment: postsCtx.addComment,

    // URL Shortener
    urlConfigs: urlCtx.urlConfigs,
    updateUrlConfig: urlCtx.updateUrlConfig,
    urlLogs: urlCtx.urlLogs,
    addUrlLog: urlCtx.addUrlLog,
  }
}
