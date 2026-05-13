"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/context/language-context"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import Navigation from "./navigation"
import Footer from "./footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Trash2,
  Package,
  Link as LinkIcon,
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  Hash,
  ExternalLink,
} from "lucide-react"

interface ResourceDisplayItem {
  id: string
  postId: string
  postTitle: string
  postSlug: string
  postLanguage: string
  title: string
  type: "upload" | "external"
  externalUrl: string | null
  fileName: string | null
  sortOrder: number
  downloadCount: number
  stepsCount: number
  createdAt: string
}

/**
 * AdminResources — Full-page listing of all downloadable resources across all posts.
 * Accessible at /admin/resources.
 */
export default function AdminResources() {
  const { language } = useLanguage()
  const [resources, setResources] = useState<ResourceDisplayItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ResourceDisplayItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchAllResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()

      // Fetch all resources with INDEPENDENT error handling
      const { data: resRows, error: resError } = await supabase
        .from("post_resources")
        .select("*")
        .order("created_at", { ascending: false })

      if (resError) {
        console.error("[AdminResources] post_resources query failed:", {
          message: (resError as any)?.message,
          details: (resError as any)?.details,
          code: (resError as any)?.code,
          raw: resError,
        })
        setError(
          `post_resources: ${(resError as any)?.message || JSON.stringify(resError) || "Unknown error"}`
        )
        return
      }

      if (!resRows || resRows.length === 0) {
        setResources([])
        return
      }

      const rows = resRows as ResourceRowFromDB[]
      const postIds = [...new Set(rows.map((r) => r.post_id))]
      const resourceIds = rows.map((r) => r.id)

      // Fetch posts — non-blocking on failure
      let postMap = new Map<string, { title: string; slug: string; language: string }>()
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, title, slug, language")
        .in("id", postIds)

      if (postsError) {
        console.error("[AdminResources] posts query failed:", (postsError as any)?.message)
      } else if (postsData) {
        for (const p of postsData as { id: string; title: string; slug: string; language: string }[]) {
          postMap.set(p.id, p)
        }
      }

      // Fetch step counts — non-blocking on failure
      let stepCountMap = new Map<string, number>()
      const { data: stepRows, error: stepsError } = await supabase
        .from("gate_steps")
        .select("resource_id")
        .in("resource_id", resourceIds)

      if (stepsError) {
        console.error("[AdminResources] gate_steps query failed:", (stepsError as any)?.message)
      } else if (stepRows) {
        for (const s of stepRows as { resource_id: string }[]) {
          stepCountMap.set(s.resource_id, (stepCountMap.get(s.resource_id) || 0) + 1)
        }
      }

      setResources(
        rows.map((row) => {
          const post = postMap.get(row.post_id)
          return {
            id: row.id,
            postId: row.post_id,
            postTitle: post?.title || "(deleted)",
            postSlug: post?.slug || "",
            postLanguage: post?.language || "unknown",
            title: row.title,
            type: row.type as "upload" | "external",
            externalUrl: row.external_url,
            fileName: row.file_name,
            sortOrder: row.sort_order,
            downloadCount: row.download_count,
            stepsCount: stepCountMap.get(row.id) || 0,
            createdAt: row.created_at,
          }
        })
      )
    } catch (err) {
      // Last-resort catch for unexpected runtime errors
      const errMsg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err)
      console.error("[AdminResources] Unexpected error:", errMsg, err)
      setError(errMsg || "Failed to load resources")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllResources()
  }, [fetchAllResources])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const supabase = createClient()
      const { error: delError } = await supabase
        .from("post_resources")
        .delete()
        .eq("id", deleteTarget.id)

      if (delError) throw delError
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      await fetchAllResources()
    } catch (err) {
      console.error("[AdminResources] Failed to delete:", err)
      setError(err instanceof Error ? err.message : "Failed to delete resource")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 pt-8 pb-24 md:pt-12 md:pb-32">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {language === "en" ? "Back to Dashboard" : "Quay lại Dashboard"}
          </Link>
        </nav>

        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 pb-6 border-b border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {language === "en" ? "Download Resources" : "Tài nguyên tải xuống"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === "en"
                    ? "Manage all downloadable resources and their unlock steps"
                    : "Quản lý tất cả tài nguyên tải xuống và bước mở khóa"}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Error banner */}
        {error && (
          <div className="bg-destructive/10 border-destructive/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
            <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Resources Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {language === "en" ? "Resource" : "Tài nguyên"}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {language === "en" ? "Post" : "Bài viết"}
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {language === "en" ? "Type" : "Loại"}
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {language === "en" ? "Steps" : "Bước"}
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {language === "en" ? "Downloads" : "Tải"}
                  </th>
                  <th className="text-right px-6 py-4 w-24" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === "en" ? "Loading resources..." : "Đang tải tài nguyên..."}
                      </div>
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Package className="w-8 h-8" />
                        <p>
                          {language === "en"
                            ? "No downloadable resources yet"
                            : "Chưa có tài nguyên tải xuống nào"}
                        </p>
                        <p className="text-xs">
                          {language === "en"
                            ? 'Edit a post and use the "Resources" tab to add some'
                            : 'Sửa bài viết và dùng tab "Tài nguyên" để thêm'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  resources.map((res, index) => (
                    <motion.tr
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      {/* Resource title + details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            {res.type === "external" ? (
                              <LinkIcon className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Upload className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{res.title}</p>
                            {res.externalUrl && (
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[250px]">
                                {res.externalUrl}
                              </p>
                            )}
                            {res.fileName && (
                              <p className="text-xs text-muted-foreground">{res.fileName}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Post */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/blog/${res.postSlug}`}
                          className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
                          target="_blank"
                        >
                          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="line-clamp-1">{res.postTitle}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                        </Link>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary mt-1">
                          {res.postLanguage === "en" ? "EN" : "VI"}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          {res.type === "external" ? (
                            <><LinkIcon className="w-3 h-3" /> Link</>
                          ) : (
                            <><Upload className="w-3 h-3" /> File</>
                          )}
                        </span>
                      </td>

                      {/* Steps */}
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium tabular-nums">{res.stepsCount}</span>
                      </td>

                      {/* Downloads */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          {res.downloadCount}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => { setDeleteTarget(res); setDeleteDialogOpen(true) }}
                          title={language === "en" ? "Delete resource" : "Xóa tài nguyên"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {!loading && resources.length > 0 && (
            <div className="border-t border-border/50 px-6 py-3 bg-muted/10">
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? `${resources.length} resource${resources.length !== 1 ? "s" : ""} total`
                  : `Tổng cộng ${resources.length} tài nguyên`}
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Delete Resource" : "Xóa tài nguyên"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "This will permanently delete this resource and all its unlock steps. This action cannot be undone."
                : "Thao tác này sẽ xóa vĩnh viễn tài nguyên và tất cả các bước mở khóa. Không thể hoàn tác."}
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="bg-muted/30 rounded-lg border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{deleteTarget.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "From post:" : "Từ bài viết:"} {deleteTarget.postTitle}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              {language === "en" ? "Cancel" : "Hủy"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {language === "en" ? "Delete" : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Internal helper type for DB row
interface ResourceRowFromDB {
  id: string
  post_id: string
  title: string
  type: string
  external_url: string | null
  file_name: string | null
  sort_order: number
  download_count: number
  created_at: string
}
