import * as React from "react"

import { cn } from "@/lib/utils"

/** Text input — clean modern style without terminal font */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-background text-foreground h-10 w-full min-w-0 rounded-lg border px-4 py-2 text-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
