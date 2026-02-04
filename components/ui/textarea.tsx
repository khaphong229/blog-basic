import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border bg-muted/30 text-foreground min-h-24 w-full border px-4 py-3 font-mono text-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "focus:border-primary focus:ring-primary/30 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] focus:ring-1 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
