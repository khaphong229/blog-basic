import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-mono font-medium uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] active:scale-[0.98]",
        destructive:
          "bg-transparent text-destructive border border-destructive hover:bg-destructive/10 hover:shadow-[0_0_15px_rgba(255,51,51,0.3)]",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(0,255,136,0.2)]",
        secondary:
          "bg-transparent text-secondary border border-secondary hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]",
        ghost: "text-muted-foreground hover:text-primary hover:bg-primary/5",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        terminal:
          "bg-transparent text-primary border border-primary/50 hover:border-primary hover:bg-primary/10 before:content-['>'] before:mr-2 before:text-primary/70",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
