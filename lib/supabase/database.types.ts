/**
 * Database Types for Supabase
 * Auto-generated based on schema design
 */

// ===========================================
// Enums & Constants
// ===========================================

export type Language = "vi" | "en"
export type PostStatus = "draft" | "published"
export type CommentStatus = "visible" | "hidden"
export type HttpMethod = "GET" | "POST" | "PUT"
export type LogStatus = "success" | "error"

// ===========================================
// Database Row Types
// ===========================================

export interface Post {
  id: string
  language: Language
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  featured_image: string | null
  status: PostStatus
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  view_count: number
  created_at: string
  updated_at: string
  linked_post_id: string | null
}

export interface Tag {
  id: string
  slug: string
  name_vi: string
  name_en: string
  created_at: string
}

export interface PostTag {
  post_id: string
  tag_id: string
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  status: CommentStatus
  created_at: string
}

export interface UrlShortenerConfig {
  id: string
  language: Language
  provider: string
  endpoint: string
  api_key: string
  http_method: HttpMethod
  body_format: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ShortenedUrl {
  id: string
  original_url: string
  short_url: string
  short_code: string | null
  language: Language
  post_id: string | null
  clicks: number
  created_at: string
}

export interface UrlShortenerLog {
  id: string
  language: Language
  test_url: string
  short_url: string | null
  status: LogStatus
  error_message: string | null
  created_at: string
}

// ===========================================
// Insert Types (for creating new records)
// ===========================================

export type PostInsert = Omit<Post, "id" | "view_count" | "created_at" | "updated_at"> & {
  id?: string
  view_count?: number
  created_at?: string
  updated_at?: string
}

export type TagInsert = Omit<Tag, "id" | "created_at"> & {
  id?: string
  created_at?: string
}

export type CommentInsert = Omit<Comment, "id" | "status" | "created_at"> & {
  id?: string
  status?: CommentStatus
  created_at?: string
}

export type UrlShortenerConfigInsert = Omit<
  UrlShortenerConfig,
  "id" | "is_active" | "created_at" | "updated_at"
> & {
  id?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export type ShortenedUrlInsert = Omit<ShortenedUrl, "id" | "clicks" | "created_at"> & {
  id?: string
  clicks?: number
  created_at?: string
}

export type UrlShortenerLogInsert = Omit<UrlShortenerLog, "id" | "created_at"> & {
  id?: string
  created_at?: string
}

// ===========================================
// Update Types (for updating records)
// ===========================================

export type PostUpdate = Partial<Omit<Post, "id" | "created_at">>
export type TagUpdate = Partial<Omit<Tag, "id" | "created_at">>
export type CommentUpdate = Partial<Omit<Comment, "id" | "post_id" | "created_at">>
export type UrlShortenerConfigUpdate = Partial<
  Omit<UrlShortenerConfig, "id" | "language" | "created_at">
>
export type ShortenedUrlUpdate = Partial<Omit<ShortenedUrl, "id" | "created_at">>

// ===========================================
// Extended Types (with relations)
// ===========================================

export interface PostWithTags extends Post {
  tags: Tag[]
}

export interface PostWithComments extends Post {
  comments: Comment[]
}

export interface PostFull extends Post {
  tags: Tag[]
  comments: Comment[]
  short_url?: ShortenedUrl | null
}

// ===========================================
// Database Schema Type (for Supabase client)
// ===========================================

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: PostInsert
        Update: PostUpdate
      }
      tags: {
        Row: Tag
        Insert: TagInsert
        Update: TagUpdate
      }
      post_tags: {
        Row: PostTag
        Insert: PostTag
        Update: never
      }
      comments: {
        Row: Comment
        Insert: CommentInsert
        Update: CommentUpdate
      }
      url_shortener_config: {
        Row: UrlShortenerConfig
        Insert: UrlShortenerConfigInsert
        Update: UrlShortenerConfigUpdate
      }
      shortened_urls: {
        Row: ShortenedUrl
        Insert: ShortenedUrlInsert
        Update: ShortenedUrlUpdate
      }
      url_shortener_logs: {
        Row: UrlShortenerLog
        Insert: UrlShortenerLogInsert
        Update: never
      }
    }
    Views: {
      public_posts: {
        Row: Post
      }
    }
    Functions: {
      increment_view_count: {
        Args: { post_id: string }
        Returns: void
      }
      increment_click_count: {
        Args: { url_id: string }
        Returns: void
      }
    }
  }
}
