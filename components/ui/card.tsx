import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border flex flex-col gap-4 border p-0 transition-all duration-300",
        "hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-primary font-mono text-sm font-semibold tracking-wider uppercase",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground font-mono text-xs", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("ml-auto", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 py-4 font-mono text-sm", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "border-border bg-muted/20 flex items-center gap-4 border-t px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

// Terminal-style window dots component
function TerminalDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="bg-destructive/80 size-3 rounded-full" />
      <div className="bg-accent/80 size-3 rounded-full" />
      <div className="bg-primary/80 size-3 rounded-full" />
    </div>
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
  TerminalDots,
}
