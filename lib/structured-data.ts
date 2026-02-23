import { SITE_URL, SITE_NAME } from "@/lib/site-config"

/**
 * Generate JSON-LD structured data for a blog post
 * Schema: https://schema.org/BlogPosting
 *
 * @example
 * // In blog detail page
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateBlogPostingLD(post) }} />
 */
export function generateBlogPostingLD(post: {
  title: string
  excerpt?: string
  author: string
  slug: string
  publishedAt?: Date | null
  updatedAt?: Date | null
  featuredImage?: string | null
  language?: string
}): string {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    ...(post.publishedAt && {
      datePublished: post.publishedAt.toISOString(),
    }),
    ...(post.updatedAt && {
      dateModified: post.updatedAt.toISOString(),
    }),
    ...(post.featuredImage && {
      image: post.featuredImage,
    }),
    ...(post.language && {
      inLanguage: post.language === "vi" ? "vi-VN" : "en-US",
    }),
  }

  return JSON.stringify(jsonLD)
}

/**
 * Generate JSON-LD for the website/organization
 * Used in root layout
 */
export function generateWebsiteLD(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  })
}
