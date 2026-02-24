import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Badge variants — clean style without terminal aesthetics */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
        outline: "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
        accent:
          "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15",
        success: "border-primary/30 bg-primary/10 text-primary",
        warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

/** Badge component — pill-shaped labels */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
