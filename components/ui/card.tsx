import * as React from "react"

import { cn } from "@/lib/utils"

/** Card container — clean modern style with rounded corners */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border flex flex-col gap-4 rounded-2xl border p-0 shadow-sm transition-all duration-300",
        "hover:shadow-md",
        className
      )}
      {...props}
    />
  )
}

/** Card header — subtle background with bottom border */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "border-border bg-muted/30 flex items-center gap-2 rounded-t-2xl border-b px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

/** Card title — semibold text */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-foreground text-base font-semibold",
        className
      )}
      {...props}
    />
  )
}

/** Card description — muted small text */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/** Card action — aligned to the right */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("ml-auto", className)} {...props} />
}

/** Card content — padded body area */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 py-4 text-sm", className)}
      {...props}
    />
  )
}

/** Card footer — bottom section with top border */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "border-border bg-muted/20 flex items-center gap-4 rounded-b-2xl border-t px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
