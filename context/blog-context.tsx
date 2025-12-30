"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

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
  addPost: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl">) => void
  updatePost: (id: string, post: Partial<BlogPost>) => void
  deletePost: (id: string) => void
  getPostBySlug: (slug: string) => BlogPost | undefined
  addComment: (postId: string, comment: Omit<Comment, "id" | "createdAt">) => void
  getPostsByLanguage: (language: "en" | "vi") => BlogPost[]
  searchPosts: (query: string, language: "en" | "vi") => BlogPost[]
  getPostsByTag: (tag: string, language: "en" | "vi") => BlogPost[]
  getAllTags: (language: "en" | "vi") => string[]
  urlConfigs: { en: URLShortenerConfig | null; vi: URLShortenerConfig | null }
  updateUrlConfig: (language: "en" | "vi", config: URLShortenerConfig) => void
  urlLogs: URLLog[]
  addUrlLog: (log: Omit<URLLog, "id" | "timestamp">) => void
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

const generateShortUrl = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `http://localhost:3000/s/${result}`
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [urlConfigs, setUrlConfigs] = useState<{ en: URLShortenerConfig | null; vi: URLShortenerConfig | null }>({
    en: null,
    vi: null,
  })
  const [urlLogs, setUrlLogs] = useState<URLLog[]>([])

  useEffect(() => {
    const samplePosts: BlogPost[] = [
      {
        id: "1",
        title: "Getting Started with Next.js",
        content: "Next.js is a powerful React framework that makes building production-ready applications easier...",
        excerpt: "Learn the basics of Next.js and start building amazing web applications",
        author: "John Doe",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        language: "en",
        slug: "getting-started-with-nextjs",
        shortUrl: "http://localhost:3000/s/a1b2",
        tags: ["nextjs", "react", "tutorial"],
        comments: [
          {
            id: "c1",
            name: "Jane Smith",
            email: "jane@example.com",
            content: "Great tutorial! Very helpful.",
            createdAt: new Date("2024-01-16"),
          },
        ],
      },
      {
        id: "2",
        title: "Các Mẹo Lập Trình React",
        content: "React là một thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng...",
        excerpt: "Khám phá các mẹo và kỹ thuật để trở thành lập trình viên React tốt hơn",
        author: "Nguyễn Văn A",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        language: "vi",
        slug: "cac-meo-lap-trinh-react",
        shortUrl: "http://localhost:3000/s/c3d4",
        tags: ["react", "tips", "javascript"],
        comments: [],
      },
    ]
    setPosts(samplePosts)
  }, [])

  const addPost = (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      slug: generateSlug(post.title),
      shortUrl: generateShortUrl(),
      comments: [],
    }
    setPosts([newPost, ...posts])
  }

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post)))
  }

  const deletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug)
  }

  const addComment = (postId: string, comment: Omit<Comment, "id" | "createdAt">) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  ...comment,
                  id: Date.now().toString(),
                  createdAt: new Date(),
                },
              ],
            }
          : post,
      ),
    )
  }

  const getPostsByLanguage = (language: "en" | "vi") => {
    return posts.filter((post) => post.language === language)
  }

  const searchPosts = (query: string, language: "en" | "vi") => {
    const lowercaseQuery = query.toLowerCase()
    return posts.filter(
      (post) =>
        post.language === language &&
        (post.title.toLowerCase().includes(lowercaseQuery) ||
          post.excerpt.toLowerCase().includes(lowercaseQuery) ||
          post.content.toLowerCase().includes(lowercaseQuery)),
    )
  }

  const getPostsByTag = (tag: string, language: "en" | "vi") => {
    return posts.filter(
      (post) => post.language === language && post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    )
  }

  const getAllTags = (language: "en" | "vi") => {
    const tags = new Set<string>()
    posts
      .filter((post) => post.language === language)
      .forEach((post) => {
        post.tags.forEach((tag) => tags.add(tag))
      })
    return Array.from(tags).sort()
  }

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

  return (
    <BlogContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        addComment,
        getPostsByLanguage,
        searchPosts,
        getPostsByTag,
        getAllTags,
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
