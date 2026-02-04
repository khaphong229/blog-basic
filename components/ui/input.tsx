import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-muted/30 text-foreground h-10 w-full min-w-0 border px-4 py-2 font-mono text-sm transition-all duration-200",
        "placeholder:text-muted-foreground/60",
        "focus:border-primary focus:ring-primary/30 focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] focus:ring-1 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-primary file:border-0 file:bg-transparent file:font-mono file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
