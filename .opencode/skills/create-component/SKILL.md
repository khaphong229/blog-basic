---
name: create-component
description: Create a new React component following project standards (Tailwind, Shadcn, TypeScript)
---

# Creating a New Component

## 1. Structure
- File name: `kebab-case.tsx`
- Component name: `PascalCase`
- Directory: `components/` (or `components/ui` for primitives)

## 2. Template
```tsx
"use client" // Remove if no interactivity needed

import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export default function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

## 3. Checklist
- [ ] Defined interface for props
- [ ] Used `cn()` for class merging
- [ ] Exported as `default`
- [ ] Added `use client` if using hooks
