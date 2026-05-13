"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Download, Lock, FileText } from "lucide-react"
import type { PostResource } from "@/types/gate"

export interface DownloadButtonProps {
  resource: PostResource
  unlocked: boolean
}

/**
 * DownloadButton — Gated download trigger.
 *
 * States:
 * - Unlocked: active button → redirects to download API
 * - Locked: disabled button showing remaining steps needed
 * - No steps: auto-unlocked, shows download immediately
 */
export default function DownloadButton({ resource, unlocked }: DownloadButtonProps) {
  const { language } = useLanguage()

  const handleDownload = () => {
    if (!unlocked) return
    // Navigate to download API — will redirect or serve
    window.location.href = `/api/gate/download/${resource.id}`
  }

  const stepCount = resource.gateSteps?.length ?? 0
  const hasFileInfo = resource.type === "upload" && resource.fileName

  if (unlocked) {
    return (
      <div className="space-y-1">
        <Button
          onClick={handleDownload}
          className="w-full gap-2"
        >
          <Download className="h-4 w-4" />
          {language === "en" ? "Download Now" : "Tải xuống ngay"}
        </Button>
        {hasFileInfo && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            {resource.fileName}
            {resource.fileSize != null && (
              <span>
                ({(resource.fileSize / 1024 / 1024).toFixed(1)} MB)
              </span>
            )}
          </p>
        )}
      </div>
    )
  }

  return (
    <Button
      disabled
      variant="secondary"
      className="w-full gap-2 opacity-60"
    >
      <Lock className="h-4 w-4" />
      {stepCount > 0
        ? language === "en"
          ? `Complete ${stepCount} step${stepCount > 1 ? "s" : ""} to unlock`
          : `Mở khóa sau ${stepCount} bước`
        : language === "en"
          ? "Locked"
          : "Đã khóa"}
    </Button>
  )
}
