import * as React from "react"

import { cn } from "@/lib/utils"

/** Textarea — clean modern style without terminal font */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border bg-background text-foreground min-h-24 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
