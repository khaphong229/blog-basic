# Blog Context API Reference

Quick reference for BlogContext state and methods.

## File Location
`context/blog-context.tsx`

## Types

### BlogPost
```typescript
interface BlogPost {
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
```

### Comment
```typescript
interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: Date
}
```

### URLShortenerConfig
```typescript
interface URLShortenerConfig {
  provider: string
  endpoint: string
  apiKey: string
  httpMethod: "GET" | "POST" | "PUT"
  bodyFormat: string
  active: boolean
}
```

### URLLog
```typescript
interface URLLog {
  id: string
  timestamp: Date
  originalUrl: string
  shortenedUrl: string
  language: "en" | "vi"
  status: "success" | "failed"
  message?: string
}
```

## Context API

### useBlog() Hook

```typescript
import { useBlog } from "@/context/blog-context"

const {
  // State
  posts,           // BlogPost[] - all posts
  urlConfigs,      // { en: URLShortenerConfig | null, vi: URLShortenerConfig | null }
  urlLogs,         // URLLog[] - URL shortening logs
  
  // Post Methods
  addPost,         // (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "comments" | "slug" | "shortUrl">) => void
  updatePost,      // (id: string, post: Partial<BlogPost>) => void
  deletePost,      // (id: string) => void
  getPostBySlug,   // (slug: string) => BlogPost | undefined
  
  // Query Methods
  getPostsByLanguage,  // (language: "en" | "vi") => BlogPost[]
  searchPosts,         // (query: string, language: "en" | "vi") => BlogPost[]
  getPostsByTag,       // (tag: string, language: "en" | "vi") => BlogPost[]
  getAllTags,          // (language: "en" | "vi") => string[]
  
  // Comment Methods
  addComment,      // (postId: string, comment: Omit<Comment, "id" | "createdAt">) => void
  
  // URL Config Methods
  updateUrlConfig, // (language: "en" | "vi", config: URLShortenerConfig) => void
  addUrlLog,       // (log: Omit<URLLog, "id" | "timestamp">) => void
} = useBlog()
```

## Usage Examples

### List Posts by Language
```typescript
const { getPostsByLanguage } = useBlog()
const { language } = useLanguage()

const posts = getPostsByLanguage(language)
```

### Search Posts
```typescript
const { searchPosts } = useBlog()
const results = searchPosts("next.js", "en")
```

### Add New Post
```typescript
const { addPost } = useBlog()

addPost({
  title: "My New Post",
  content: "Post content here...",
  excerpt: "Short summary",
  author: "John Doe",
  language: "en",
  tags: ["react", "tutorial"],
})
```

### Update Post
```typescript
const { updatePost } = useBlog()
updatePost("post-id", { title: "Updated Title" })
```

### Delete Post
```typescript
const { deletePost } = useBlog()
deletePost("post-id")
```

### Add Comment
```typescript
const { addComment } = useBlog()
addComment("post-id", {
  name: "Jane",
  email: "jane@example.com",
  content: "Great post!",
})
```

### Filter by Tag
```typescript
const { getPostsByTag, getAllTags } = useBlog()

const tags = getAllTags("en")        // ["react", "nextjs", "tutorial"]
const posts = getPostsByTag("react", "en")
```

## Provider Setup

```typescript
// In page.tsx
import { BlogProvider } from "@/context/blog-context"

export default function Page() {
  return (
    <BlogProvider>
      <YourComponent />
    </BlogProvider>
  )
}
```
