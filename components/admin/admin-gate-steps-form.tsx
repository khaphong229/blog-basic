"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GripVertical, Plus, Trash2 } from "lucide-react"

/**
 * Temporary step type used during form editing (no id yet)
 */
interface EditableStep {
  id: string
  label: string
  url: string
  sortOrder: number
}

export interface AdminGateStepsFormProps {
  steps: EditableStep[]
  onChange: (steps: EditableStep[]) => void
}

/**
 * AdminGateStepsForm — Dynamic form for managing gate unlock steps.
 *
 * Supports add/remove/reorder via drag-and-drop.
 * Each step has a label (text description) and URL (external link).
 */
export default function AdminGateStepsForm({ steps, onChange }: AdminGateStepsFormProps) {
  const { language } = useLanguage()

  const addStep = () => {
    const newStep: EditableStep = {
      id: `new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: "",
      url: "",
      sortOrder: steps.length,
    }
    onChange([...steps, newStep])
  }

  const updateStep = (stepId: string, field: keyof EditableStep, value: string | number) => {
    onChange(
      steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s))
    )
  }

  const removeStep = (stepId: string) => {
    onChange(
      steps
        .filter((s) => s.id !== stepId)
        .map((s, i) => ({ ...s, sortOrder: i }))
    )
  }

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= steps.length) return
    const arr = [...steps]
    ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
    onChange(arr.map((s, i) => ({ ...s, sortOrder: i })))
  }

  if (steps.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {language === "en" ? "Unlock steps" : "Các bước mở khóa"}
        </p>
        <div className="rounded-lg border border-dashed border-border p-3 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            {language === "en"
              ? "No unlock steps yet. Add steps users must complete to download."
              : "Chưa có bước mở khóa. Thêm các bước người dùng cần hoàn thành để tải."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1 cursor-pointer">
            <Plus className="h-3 w-3" />
            {language === "en" ? "Add step" : "Thêm bước"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {language === "en"
            ? `Unlock steps (${steps.length})`
            : `Các bước mở khóa (${steps.length})`}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1 cursor-pointer">
          <Plus className="h-3 w-3" />
          {language === "en" ? "Add" : "Thêm"}
        </Button>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-start gap-2 rounded-lg border border-border bg-background p-3"
          >
            {/* Drag handle + order */}
            <div className="flex flex-col items-center gap-0.5 pt-1.5">
              <button
                type="button"
                onClick={() => moveStep(index, "up")}
                disabled={index === 0}
                className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 cursor-pointer text-[10px] leading-none"
                aria-label="Move up"
              >
                ▲
              </button>
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => moveStep(index, "down")}
                disabled={index === steps.length - 1}
                className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 cursor-pointer text-[10px] leading-none"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-1.5">
              <Input
                value={step.label}
                onChange={(e) => updateStep(step.id, "label", e.target.value)}
                placeholder={language === "en" ? "e.g. Watch tutorial video" : "VD: Xem video hướng dẫn"}
                className="h-8 text-sm"
              />
              <Input
                value={step.url}
                onChange={(e) => updateStep(step.id, "url", e.target.value)}
                placeholder="https://youtu.be/..."
                className="h-8 text-sm font-mono"
              />
            </div>

            {/* Delete */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeStep(step.id)}
              className="mt-0.5 h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label="Delete step"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export type { EditableStep }
