# Component Patterns Reference

Examples of component patterns used in this project.

## File Locations
- `components/` - Feature components
- `components/ui/` - Reusable UI components

## Standard Component Pattern

### Basic Client Component
```typescript
// components/example-component.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

interface ExampleComponentProps {
  className?: string
  title: string
  onAction?: () => void
}

export default function ExampleComponent({ 
  className, 
  title, 
  onAction 
}: ExampleComponentProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("base-classes", className)}>
      <h2>{title}</h2>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {t("blog.readMore")}
      </Button>
    </div>
  )
}
```

## Real Example: BlogCard Component

Location: `components/ui/blog-card.tsx`

```typescript
"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/context/blog-context"

interface BlogCardProps {
  post: BlogPost
  language: "en" | "vi"
}

export function BlogCard({ post, language }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group h-full block">
      <Card className="h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <time>{post.createdAt.toLocaleDateString()}</time>
          </div>
          <h3 className="text-2xl font-serif font-bold">{post.title}</h3>
        </CardHeader>
        
        <CardContent className="grow pb-4">
          <p className="text-muted-foreground">{post.excerpt}</p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
            <span className="text-primary flex items-center gap-1">
              {language === "en" ? "Read Article" : "Đọc bài viết"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
```

## Import Patterns

### Order of Imports
```typescript
// 1. React/Next.js
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// 2. UI Components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 3. Icons
import { ArrowRight, Calendar } from "lucide-react"

// 4. Context/Hooks
import { useLanguage } from "@/context/language-context"
import { useBlog, type BlogPost } from "@/context/blog-context"

// 5. Utils
import { cn } from "@/lib/utils"
```

## Common Patterns

### Conditional Classes with cn()
```typescript
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-variant",
  className
)} />
```

### Type Import
```typescript
import type { BlogPost } from "@/context/blog-context"
```

### Event Handlers
```typescript
const handleClick = () => {
  // logic
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // logic
}
```

## When to Use "use client"

Add `"use client"` at the top when using:
- React hooks (useState, useEffect, useContext)
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs (localStorage, window)
- Third-party hooks (useForm, useAnimation)
