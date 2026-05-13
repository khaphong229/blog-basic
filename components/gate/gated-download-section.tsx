"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, RefreshCw } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"
import GateStepItem from "./gate-step-item"
import DownloadButton from "./download-button"
import type { PostResource } from "@/types/gate"

export interface GatedDownloadSectionProps {
  postId: string
  resources: PostResource[]
}

/**
 * GatedDownloadSection — Full gate + download UI block.
 *
 * Fetches unlock status from /api/gate/status/{postId} on mount,
 * renders resources with their gate steps and download buttons,
 * and polls every 5s to sync completion state (user may return from redirect).
 */
export default function GatedDownloadSection({
  postId,
  resources,
}: GatedDownloadSectionProps) {
  const { language } = useLanguage()
  const [unlockedResourceIds, setUnlockedResourceIds] = useState<Set<string>>(new Set())
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  /** Fetch gate status from API */
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/gate/status/${postId}`)
      if (!res.ok) return
      const data: { status: { unlockedResourceIds: string[]; completedStepIds: string[] } } =
        await res.json()

      setUnlockedResourceIds(new Set(data.status.unlockedResourceIds))
      setCompletedStepIds(new Set(data.status.completedStepIds))
      setLastSync(new Date())
    } catch (err) {
      console.error("[GatedDownloadSection] Failed to fetch status:", err)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  // Fetch on mount
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Poll every 5s to sync completion after redirect returns
  useEffect(() => {
    const hasUncompletedSteps = resources.some(
      (r) =>
        r.gateSteps &&
        r.gateSteps.length > 0 &&
        !r.gateSteps.every((s) => completedStepIds.has(s.id))
    )
    if (!hasUncompletedSteps) return

    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [resources, completedStepIds, fetchStatus])

  /** Handle step completion (optimistic update) */
  const handleStepComplete = useCallback((stepId: string) => {
    setCompletedStepIds((prev) => {
      const next = new Set(prev)
      next.add(stepId)
      // Recalculate unlocked resources
      // Note: relies on next status poll for authoritative calculation
      return next
    })
  }, [])

  // Show nothing if no resources
  if (!resources || resources.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="my-8 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <Package className="h-5 w-5 text-primary" />
          {language === "en" ? "Download Resources" : "Tài nguyên tải xuống"}
        </h3>
        {isLoading && (
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Loading state */}
      {isLoading && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((r) => (
            <div key={r.id} className="animate-pulse space-y-2">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-10 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Resources list */}
      {!isLoading && (
        <div className="space-y-5">
          {resources.map((resource, idx) => {
            const isUnlocked = unlockedResourceIds.has(resource.id)
            const hasSteps = resource.gateSteps && resource.gateSteps.length > 0

            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  isUnlocked
                    ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/10"
                    : "border-border bg-background/50"
                )}
              >
                {/* Resource title */}
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  {resource.title}
                  {isUnlocked && hasSteps && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      {language === "en" ? "Unlocked" : "Đã mở khóa"}
                    </span>
                  )}
                </h4>

                {/* Gate steps */}
                {hasSteps && (
                  <div className="mb-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {resource.gateSteps.map((step) => (
                        <motion.div
                          key={step.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <GateStepItem
                            step={step}
                            completed={completedStepIds.has(step.id)}
                            onComplete={handleStepComplete}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Download button */}
                <DownloadButton resource={resource} unlocked={isUnlocked} />
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Last sync indicator */}
      {lastSync && (
        <p className="mt-3 text-[10px] text-muted-foreground/60 text-right">
          {language === "en" ? "Synced" : "Đã đồng bộ"}{" "}
          {lastSync.toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  )
}
