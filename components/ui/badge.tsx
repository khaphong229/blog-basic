import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wider transition-all",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary/10 text-primary hover:border-primary hover:shadow-[0_0_10px_rgba(0,255,136,0.2)]",
        secondary:
          "border-secondary/50 bg-secondary/10 text-secondary hover:border-secondary hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]",
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive hover:border-destructive",
        outline: "border-border text-muted-foreground hover:border-primary hover:text-primary",
        accent:
          "border-accent/50 bg-accent/10 text-accent hover:border-accent hover:shadow-[0_0_10px_rgba(255,107,53,0.2)]",
        success: "border-primary bg-primary/20 text-primary",
        warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
