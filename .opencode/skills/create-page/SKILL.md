---
name: create-page
description: Create a new Next.js App Router page with proper layout and metadata
---

# Creating a New Page

## 1. Location
- Route: `app/path/to/page/page.tsx`
- Dynamic Route: `app/blog/[slug]/page.tsx`

## 2. Template
```tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
}

export default function Page() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Title</h1>
    </main>
  )
}
```

## 3. Data Fetching
- Make the component `async` if fetching data.
- Use `await` for params in dynamic routes (Next.js 15+).
