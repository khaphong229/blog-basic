# Coding Standards & Patterns

## File & Naming Conventions
- **Components**: PascalCase (`HomePage`, `BlogCard`)
- **Component files**: kebab-case (`home-page.tsx`, `blog-card.tsx`)
- **Utilities/functions**: camelCase (`cn`, `generateSlug`)
- **Types/Interfaces**: PascalCase (`BlogPost`, `LanguageContextType`)
- **Hooks**: `use` prefix (`useLanguage`, `useBlog`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for objects

## TypeScript Guidelines
**Strict Mode**: Always enabled.

```typescript
// ✅ DO: Use type imports for type-only imports
import type { NextConfig } from "next"

// ✅ DO: Define interfaces for component props
interface ButtonProps {
  children: React.ReactNode
}

// ✅ DO: Use explicit types for context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// ✅ DO: Use path aliases
import { cn } from "@/lib/utils"

// ❌ DON'T: Use 'any' type
// ❌ DON'T: Skip type definitions for props
// ❌ DON'T: Use relative imports for cross-directory imports
```

## Server vs Client Components
- **Default**: Server Components (no "use client" directive)
- **Use "use client"** when you need:
  - React hooks (useState, useEffect, useContext)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Third-party libraries that use hooks

## Context Pattern
```typescript
"use client"
import { createContext, useContext, useState } from "react"

const MyContext = createContext<MyContextType | undefined>(undefined)

export function MyProvider({ children }: { children: React.ReactNode }) {
  return <MyContext.Provider value={/* ... */}>{children}</MyContext.Provider>
}

export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) throw new Error("useMyContext must be used within MyProvider")
  return context
}
```

## Bilingual Support (i18n)
Use the translation system for all user-facing strings:
```typescript
const { t } = useLanguage()
<h1>{t("home.title")}</h1>  // ✅ DO
<h1>Welcome</h1>            // ❌ DON'T hardcode English
```

## Error Handling
```typescript
// ✅ DO: Validate context usage
if (!context) throw new Error("Must be used within Provider")

// ✅ DO: Use Zod for form validation
import { z } from "zod"
const formSchema = z.object({ email: z.string().email() })

// ✅ DO: Handle async errors
try {
  await someAsyncOperation()
} catch (error) {
  console.error("Operation failed:", error)
}
```
