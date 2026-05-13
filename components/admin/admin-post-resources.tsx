"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/context/language-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AdminGateStepsForm from "./admin-gate-steps-form"
import type { EditableStep } from "./admin-gate-steps-form"
import {
  Plus,
  Trash2,
  Save,
  Link as LinkIcon,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

export interface AdminPostResourcesProps {
  postId: string
}

interface EditableResource {
  id: string
  title: string
  type: "upload" | "external"
  externalUrl: string
  sortOrder: number
  steps: EditableStep[]
}

/**
 * AdminPostResources — Full CRUD manager for a post's downloadable resources.
 *
 * Used within the admin edit post dialog.
 * Manages resources and their gate steps independently of post content.
 */
export default function AdminPostResources({ postId }: AdminPostResourcesProps) {
  const { language } = useLanguage()
  const [resources, setResources] = useState<EditableResource[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /** Generate a temporary ID for new items */
  const tempId = () => `new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  /** Load existing resources from DB */
  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: resourceRows, error: resError } = await supabase
        .from("post_resources")
        .select("*")
        .eq("post_id", postId)
        .order("sort_order", { ascending: true })

      if (resError) throw resError

      const resourceIds = ((resourceRows as { id: string }[]) || []).map((r) => r.id)
      let stepsByResource = new Map<string, EditableStep[]>()

      if (resourceIds.length > 0) {
        const { data: stepRows } = await supabase
          .from("gate_steps")
          .select("*")
          .in("resource_id", resourceIds)
          .order("sort_order", { ascending: true })

        if (stepRows) {
          for (const step of stepRows as EditableStepRow[]) {
            const existing = stepsByResource.get(step.resource_id) || []
            existing.push({
              id: step.id,
              label: step.label,
              url: step.url,
              sortOrder: step.sort_order,
            })
            stepsByResource.set(step.resource_id, existing)
          }
        }
      }

      setResources(
        ((resourceRows as PostResourceRowFromDB[]) || []).map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type as "upload" | "external",
          externalUrl: row.external_url ?? "",
          sortOrder: row.sort_order,
          steps: stepsByResource.get(row.id) || [],
        }))
      )
    } catch (err) {
      console.error("[AdminPostResources] Failed to fetch:", err)
      setError(err instanceof Error ? err.message : "Failed to load resources")
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const addResource = () => {
    setResources((prev) => [
      ...prev,
      {
        id: tempId(),
        title: "",
        type: "external",
        externalUrl: "",
        sortOrder: prev.length,
        steps: [],
      },
    ])
  }

  const updateResource = (resId: string, field: keyof EditableResource, value: unknown) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, [field]: value } : r))
    )
  }

  const removeResource = (resId: string) => {
    setResources((prev) =>
      prev.filter((r) => r.id !== resId).map((r, i) => ({ ...r, sortOrder: i }))
    )
  }

  const updateSteps = (resId: string, steps: EditableStep[]) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, steps } : r))
    )
  }

  /** Save all resources (delete-all + re-insert for simplicity) */
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const supabase = createClient()

      // Delete all existing resources for this post (CASCADE deletes steps + completions)
      const { error: delError } = await supabase
        .from("post_resources")
        .delete()
        .eq("post_id", postId)

      if (delError) throw delError

      // Insert each resource with its steps
      for (const resource of resources) {
          const { data: newResource, error: insError } = await supabase
            .from("post_resources")
            .insert({
              post_id: postId,
              title: resource.title.trim() || "Untitled",
              type: resource.type,
              file_path: null,
              file_name: null,
              file_size: null,
              external_url: resource.externalUrl || null,
              sort_order: resource.sortOrder,
            })
            .select("id")
            .single()

        if (insError) throw insError

        const newId = (newResource as { id: string }).id

        // Insert steps for this resource
        if (resource.steps.length > 0) {
          const { error: stepsError } = await supabase.from("gate_steps").insert(
            resource.steps.map((step) => ({
              resource_id: newId,
              label: step.label.trim() || "Step",
              url: step.url.trim(),
              sort_order: step.sortOrder,
            }))
          )

          if (stepsError) throw stepsError
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await fetchResources()
    } catch (err) {
      console.error("[AdminPostResources] Failed to save:", err)
      setError(err instanceof Error ? err.message : "Failed to save resources")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          {language === "en" ? "Loading resources..." : "Đang tải tài nguyên..."}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {language === "en"
            ? "Downloadable Resources"
            : "Tài nguyên tải xuống"}
          {resources.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              ({resources.length})
            </span>
          )}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addResource}
          className="gap-1 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          {language === "en" ? "Add" : "Thêm"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {language === "en" ? "Saved successfully!" : "Đã lưu thành công!"}
        </div>
      )}

      {/* Empty state */}
      {resources.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? "No resources yet. Click \"Add\" to create downloadable content."
              : "Chưa có tài nguyên. Nhấn \"Thêm\" để tạo nội dung tải xuống."}
          </p>
        </div>
      )}

      {/* Resource cards */}
      {resources.map((resource, idx) => (
        <div
          key={resource.id}
          className="rounded-lg border border-border bg-card p-4 space-y-3"
        >
          {/* Resource header with order */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {language === "en" ? `Resource ${idx + 1}` : `Tài nguyên ${idx + 1}`}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeResource(resource.id)}
              className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label="Delete resource"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {language === "en" ? "Title" : "Tiêu đề"}
            </label>
            <Input
              value={resource.title}
              onChange={(e) => updateResource(resource.id, "title", e.target.value)}
              placeholder={language === "en" ? "e.g. Source Code v2.0" : "VD: Source Code v2.0"}
              className="h-8 text-sm"
            />
          </div>

          {/* Type selector + URL */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {language === "en" ? "Type" : "Loại"}
              </label>
              <Select
                value={resource.type}
                onValueChange={(val) =>
                  updateResource(resource.id, "type", val as "upload" | "external")
                }
              >
                <SelectTrigger className="h-8 text-sm cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">
                    <span className="flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5" />
                      {language === "en" ? "External Link" : "Link ngoài"}
                    </span>
                  </SelectItem>
                  <SelectItem value="upload">
                    <span className="flex items-center gap-2">
                      <Upload className="h-3.5 w-3.5" />
                      {language === "en" ? "File Upload" : "Upload file"}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {resource.type === "external"
                  ? language === "en"
                    ? "External URL"
                    : "URL liên kết"
                  : language === "en"
                    ? "File path"
                    : "Đường dẫn file"}
              </label>
              <Input
                value={resource.externalUrl}
                onChange={(e) => updateResource(resource.id, "externalUrl", e.target.value)}
                placeholder={
                  resource.type === "external"
                    ? "https://bit.ly/..."
                    : language === "en"
                      ? "Upload via admin panel"
                      : "Upload qua admin"
                }
                className="h-8 text-sm font-mono"
                disabled={resource.type === "upload"}
              />
            </div>
          </div>

          {/* Gate steps */}
          <AdminGateStepsForm
            steps={resource.steps}
            onChange={(steps) => updateSteps(resource.id, steps)}
          />
        </div>
      ))}

      {/* Save button */}
      {resources.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="gap-2 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving
              ? language === "en"
                ? "Saving..."
                : "Đang lưu..."
              : language === "en"
                ? "Save All Resources"
                : "Lưu tất cả tài nguyên"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Internal helper types for DB row shapes
interface PostResourceRowFromDB {
  id: string
  title: string
  type: string
  external_url: string | null
  sort_order: number
}

interface EditableStepRow {
  id: string
  resource_id: string
  label: string
  url: string
  sort_order: number
}
