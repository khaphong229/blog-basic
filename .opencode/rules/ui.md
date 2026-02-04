# UI & Styling Guidelines

## Import Order
Organize imports in this order:
```typescript
// 1. External libraries
import { useState } from "react"
import { useRouter } from "next/navigation"

// 2. UI components
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

// 3. Custom components
import Navigation from "@/components/navigation"

// 4. Context/hooks
import { useLanguage } from "@/context/language-context"

// 5. Types (use type imports)
import type { BlogPost } from "@/types"

// 6. Utilities
import { cn } from "@/lib/utils"
```

## Component Structure
Follow this pattern for all components:
```typescript
"use client"  // Only if needed

// Imports
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

// Types
interface MyComponentProps {
  title: string
  onSubmit?: () => void
}

// Component
export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  // Hooks at the top
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  
  // Event handlers
  const handleClick = () => {
    setIsOpen(true)
  }
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Styling Guidelines
**Tailwind-First Approach**: Use Tailwind utilities for all styling.

```typescript
// ✅ DO: Use cn() utility for conditional classes
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)} />

// ✅ DO: Use CVA for component variants (shadcn/ui pattern)
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ✅ DO: Use CSS variables for theming
<div className="bg-background text-foreground" />

// ✅ DO: Add data-slot attributes for component parts (shadcn/ui v2)
<button data-slot="button" data-variant={variant} />

// ❌ DON'T: Use inline styles unless absolutely necessary
// ❌ DON'T: Create separate CSS modules
```
