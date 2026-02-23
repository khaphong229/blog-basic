import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlugServer, incrementViewCountServer } from "@/lib/api/posts.server"
import BlogPostDetail from "@/components/blog-post-detail"
import CommentsSection from "@/components/comments-section"
import Navigation from "@/components/navigation"
import AnimatedGradientBackdrop from "@/components/animated-gradient-backdrop"
import { generateBlogPostingLD } from "@/lib/structured-data"

// ===========================================
// Dynamic SEO metadata for each blog post
// ===========================================

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params

  // Try both languages — prefer the one that matches
  const post =
    (await getPostBySlugServer(params.slug, "vi")) ||
    (await getPostBySlugServer(params.slug, "en"))

  if (!post) {
    return {
      title: "Post Not Found | DevBlog",
      description: "The requested blog post could not be found.",
    }
  }

  const description = post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160)

  return {
    title: `${post.title} | DevBlog`,
    description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      authors: [post.author],
      tags: post.tags.map((t) => t.slug),
      ...(post.featured_image && { images: [{ url: post.featured_image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.featured_image && { images: [post.featured_image] }),
    },
  }
}

// ===========================================
// Server Component: Blog Detail Page
// ===========================================

export default async function BlogDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  // Fetch post from server (try both languages)
  const post =
    (await getPostBySlugServer(params.slug, "vi")) ||
    (await getPostBySlugServer(params.slug, "en"))

  if (!post) {
    notFound()
  }

  // Increment view count (fire-and-forget, don't block render)
  incrementViewCountServer(post.id).catch(() => {
    // Silently fail — view count is non-critical
  })

  // Convert server data to the BlogPost shape expected by client components
  const blogPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    author: post.author,
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
    language: post.language as "en" | "vi",
    slug: post.slug,
    comments: post.comments.map((c) => ({
      id: c.id,
      name: c.author_name,
      email: c.author_email,
      content: c.content,
      createdAt: new Date(c.created_at),
    })),
    shortUrl: "",
    tags: post.tags.map((t) => t.slug),
    status: post.status as "draft" | "published",
    publishedAt: post.published_at ? new Date(post.published_at) : null,
    viewCount: post.view_count,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    featuredImage: post.featured_image,
    linkedPostId: post.linked_post_id,
  }

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <AnimatedGradientBackdrop />
      <Navigation />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBlogPostingLD({
            title: blogPost.title,
            excerpt: blogPost.excerpt,
            author: blogPost.author,
            slug: blogPost.slug,
            publishedAt: blogPost.publishedAt,
            updatedAt: blogPost.updatedAt,
            featuredImage: blogPost.featuredImage,
            language: blogPost.language,
          }),
        }}
      />

      {/* Main content — server-rendered for SEO */}
      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <BlogPostDetail post={blogPost} />

        {/* Comments section (client interactive) */}
        <div className="mx-auto mt-12 max-w-4xl">
          <CommentsSection post={blogPost} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border bg-card/50 relative z-10 border-t py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground flex items-center justify-center gap-2 font-mono text-xs">
            <span>© 2024 DevBlog — Built with Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
