"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"
import { Check, ExternalLink } from "lucide-react"

export interface GateStepItemProps {
  step: {
    id: string
    label: string
    url: string
  }
  completed: boolean
  onComplete: (stepId: string) => void
}

/**
 * GateStepItem — Single unlock step in the gated download flow.
 *
 * States:
 * - Incomplete: clickable button → opens external URL via redirect API
 * - Completed: green checkmark, disabled
 */
export default function GateStepItem({ step, completed, onComplete }: GateStepItemProps) {
  const { language } = useLanguage()

  const handleClick = () => {
    if (completed) return

    // Open redirect URL in new tab (user will be redirected to external site)
    window.open(`/api/gate/redirect/${step.id}`, "_blank")

    // Optimistically mark as completed
    onComplete(step.id)
  }

  return (
    <button
      type="button"
      disabled={completed}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
        completed
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 cursor-default"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm active:scale-[0.98] cursor-pointer"
      )}
    >
      {/* Status icon */}
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          completed
            ? "bg-green-500 text-white"
            : "bg-muted text-muted-foreground"
        )}
      >
        {completed ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <ExternalLink className="h-3.5 w-3.5" />
        )}
      </span>

      {/* Label */}
      <span className="flex-1 font-medium">{step.label}</span>

      {/* Completion badge */}
      {completed && (
        <span className="shrink-0 text-xs font-medium text-green-600 dark:text-green-400">
          {language === "en" ? "Done" : "Xong"}
        </span>
      )}
    </button>
  )
}
