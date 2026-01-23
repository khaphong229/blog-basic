# UI Component Variants Reference

shadcn/ui component patterns with CVA (class-variance-authority).

## File Location
`components/ui/` - All reusable UI components

## Real Example: Button Component

Location: `components/ui/button.tsx`

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background shadow-xs hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

## CVA Pattern Template

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  // Base classes
  "base-class-1 base-class-2",
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        primary: "primary-variant-classes",
        secondary: "secondary-variant-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Component, componentVariants }
```

## Available UI Components

| Component | Variants | Location |
|-----------|----------|----------|
| Button | variant, size | `components/ui/button.tsx` |
| Badge | variant | `components/ui/badge.tsx` |
| Card | - | `components/ui/card.tsx` |
| Input | - | `components/ui/input.tsx` |
| Textarea | - | `components/ui/textarea.tsx` |
| Dialog | - | `components/ui/dialog.tsx` |

## Button Variants

```typescript
// Variant options
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Size options
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

## Badge Variants

```typescript
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## CSS Variables (Theme)

Use these CSS variables for consistent theming:

```css
/* Backgrounds */
bg-background      /* Main background */
bg-card            /* Card background */
bg-primary         /* Primary color */
bg-secondary       /* Secondary color */
bg-muted           /* Muted background */
bg-accent          /* Accent background */
bg-destructive     /* Error/destructive */

/* Text */
text-foreground           /* Main text */
text-primary-foreground   /* Text on primary */
text-muted-foreground     /* Muted text */

/* Borders */
border-border      /* Default border */
border-input       /* Input border */
```

## Tailwind v4 Syntax

Use new Tailwind v4 class names:

```typescript
// Gradients
"bg-linear-to-r"    // Not "bg-gradient-to-r"
"bg-linear-to-b"

// Flex
"grow"              // Not "flex-grow"
"shrink"            // Not "flex-shrink"

// Shadows
"shadow-xs"         // Extra small
"shadow-sm"
"shadow-md"
"shadow-lg"
"shadow-xl"
```

## data-slot Attributes

Add `data-slot` for styling hooks:

```typescript
<div data-slot="card-header" className="...">
<button data-slot="button" data-variant={variant} className="...">
```
