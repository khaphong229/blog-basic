# Page Structure Reference

Next.js App Router page patterns used in this project.

## File Locations
- `app/page.tsx` - Home page
- `app/blog/[slug]/page.tsx` - Dynamic blog detail
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/settings/page.tsx` - Admin settings

## Standard Page Pattern

All pages wrap content with providers:

```typescript
// app/example/page.tsx
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import ExamplePage from "@/components/example-page"

export const metadata = {
  title: "Page Title | Blog",
  description: "SEO description",
}

export default function Page() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <ExamplePage />
      </BlogProvider>
    </LanguageProvider>
  )
}
```

## Real Examples

### Home Page
Location: `app/page.tsx`

```typescript
import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import HomePage from "@/components/home-page"

export default function Page() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <HomePage />
      </BlogProvider>
    </LanguageProvider>
  )
}
```

### Dynamic Route (Blog Detail)
Location: `app/blog/[slug]/page.tsx`

```typescript
import { BlogProvider } from "@/context/blog-context"
import { LanguageProvider } from "@/context/language-context"
import BlogDetailPage from "@/components/blog-detail-page"

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <LanguageProvider>
      <BlogProvider>
        <BlogDetailPage slug={params.slug} />
      </BlogProvider>
    </LanguageProvider>
  )
}
```

## Route Structure

```
app/
├── page.tsx                    # / (Home)
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── blog/
│   └── [slug]/
│       └── page.tsx            # /blog/:slug (Dynamic)
└── admin/
    ├── page.tsx                # /admin (Dashboard)
    └── settings/
        └── page.tsx            # /admin/settings
```

## Creating New Routes

### Static Route
```bash
# Create /about page
mkdir -p app/about
# Create app/about/page.tsx
```

### Dynamic Route
```bash
# Create /posts/:id page
mkdir -p app/posts/[id]
# Create app/posts/[id]/page.tsx
```

### Nested Dynamic Route
```bash
# Create /users/:userId/posts/:postId
mkdir -p app/users/[userId]/posts/[postId]
```

## Page Props

### Static Page
```typescript
export default function Page() {
  // No props needed
}
```

### Dynamic Page
```typescript
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  // Use slug
}
```

### With Search Params
```typescript
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = searchParams.page || "1"
}
```

## Metadata

```typescript
// Static metadata
export const metadata = {
  title: "Page Title",
  description: "Page description",
}

// Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${params.slug} | Blog`,
  }
}
```

## Provider Order

Always wrap in this order:
1. `LanguageProvider` (outer)
2. `BlogProvider` (inner)
3. Page component (innermost)

```typescript
<LanguageProvider>
  <BlogProvider>
    <YourPageComponent />
  </BlogProvider>
</LanguageProvider>
```
