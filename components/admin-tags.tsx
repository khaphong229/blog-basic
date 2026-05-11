"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { createClient } from "@/lib/supabase/client"
import type { Tag } from "@/lib/supabase"
import { motion } from "framer-motion"
import Navigation from "./navigation"
import Footer from "./footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Plus,
  Pencil,
  Trash2,
  Tag as TagIcon,
  Hash,
  Languages,
  FileText,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react"

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

export default function AdminTags() {
  const { language, t } = useLanguage()
  const [tags, setTags] = useState<(Tag & { post_count?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [formNameVi, setFormNameVi] = useState("")
  const [formNameEn, setFormNameEn] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formSlugManuallyEdited, setFormSlugManuallyEdited] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: tagsData, error: tagsError } = await supabase
        .from("tags")
        .select("*")
        .order("slug", { ascending: true })
      if (tagsError) throw tagsError

      const tagsList = (tagsData as Tag[]) || []

      const { data: postTagsData } = await supabase
        .from("post_tags")
        .select("tag_id")
      const countMap = new Map<string, number>()
      if (postTagsData) {
        for (const pt of postTagsData as { tag_id: string }[]) {
          countMap.set(pt.tag_id, (countMap.get(pt.tag_id) || 0) + 1)
        }
      }

      setTags(tagsList.map((tag) => ({ ...tag, post_count: countMap.get(tag.id) || 0 })))
    } catch (err) {
      console.error("Failed to fetch tags:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch tags")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTags() }, [])

  const openCreateDialog = () => {
    setEditingTag(null)
    setFormNameVi("")
    setFormNameEn("")
    setFormSlug("")
    setFormSlugManuallyEdited(false)
    setFormError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag)
    setFormNameVi(tag.name_vi)
    setFormNameEn(tag.name_en)
    setFormSlug(tag.slug)
    setFormSlugManuallyEdited(true)
    setFormError(null)
    setDialogOpen(true)
  }

  const handleFormNameViChange = (value: string) => {
    setFormNameVi(value)
    if (!formSlugManuallyEdited) {
      setFormSlug(generateSlug(value))
    }
  }

  const handleSave = async () => {
    setFormError(null)
    if (!formNameVi.trim() || !formNameEn.trim()) {
      setFormError(
        language === "en"
          ? "Please fill in both VI Name and EN Name"
          : "Vui lòng điền cả Tên VI và Tên EN"
      )
      return
    }

    const slug = formSlug.trim() || generateSlug(formNameVi)
    if (!slug) {
      setFormError(
        language === "en" ? "Slug is required" : "Đường dẫn là bắt buộc"
      )
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()

      if (editingTag) {
        const { error: updateError } = await supabase
          .from("tags")
          .update({ slug, name_vi: formNameVi.trim(), name_en: formNameEn.trim() } as never)
          .eq("id", editingTag.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("tags")
          .insert({ slug, name_vi: formNameVi.trim(), name_en: formNameEn.trim() } as never)
        if (insertError) throw insertError
      }

      setDialogOpen(false)
      await fetchTags()
    } catch (err) {
      console.error("Failed to save tag:", err)
      setFormError(err instanceof Error ? err.message : "Failed to save tag")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTag) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from("tags").delete().eq("id", deletingTag.id)
      if (deleteError) throw deleteError
      setDeleteDialogOpen(false)
      setDeletingTag(null)
      await fetchTags()
    } catch (err) {
      console.error("Failed to delete tag:", err)
      setError(err instanceof Error ? err.message : "Failed to delete tag")
    } finally {
      setSaving(false)
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
                <TagIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t("admin.tagManagement")}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t("admin.tagManagementDesc")}
                </p>
              </div>
            </div>
            <Button onClick={openCreateDialog} className="gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              {t("admin.addTag")}
            </Button>
          </div>
        </motion.header>

        {/* Error banner */}
        {error && (
          <div className="bg-destructive/10 border-destructive/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
            <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Tags Table */}
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
                    {t("admin.slug")}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {t("admin.nameVi")}
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4">
                    {t("admin.nameEn")}
                  </th>
                  <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4 w-20">
                    {t("admin.postCount")}
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground px-6 py-4 w-40">
                    {t("admin.createdAt")}
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
                        {language === "en" ? "Loading tags..." : "Đang tải thẻ..."}
                      </div>
                    </td>
                  </tr>
                ) : tags.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <TagIcon className="w-8 h-8" />
                        <p>{t("admin.noTags")}</p>
                        <Button variant="outline" size="sm" onClick={openCreateDialog} className="cursor-pointer">
                          <Plus className="w-4 h-4 mr-1" />
                          {t("admin.addTag")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tags.map((tag, index) => (
                    <motion.tr
                      key={tag.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="font-mono text-sm text-foreground">{tag.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold bg-primary/10 text-primary shrink-0">VI</span>
                          <span className="text-sm text-foreground">{tag.name_vi}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">EN</span>
                          <span className="text-sm text-foreground">{tag.name_en}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" />
                          {tag.post_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(tag.created_at).toLocaleDateString(language === "en" ? "en-US" : "vi-VN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => openEditDialog(tag)}
                            title={t("admin.edit")}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                            onClick={() => { setDeletingTag(tag); setDeleteDialogOpen(true) }}
                            title={t("admin.delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          {!loading && tags.length > 0 && (
            <div className="border-t border-border/50 px-6 py-3 bg-muted/10">
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? `${tags.length} tag${tags.length !== 1 ? "s" : ""} total`
                  : `Tổng cộng ${tags.length} thẻ`}
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTag ? t("admin.editTag") : t("admin.addTag")}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Fill in the details below to save the tag."
                : "Điền thông tin bên dưới để lưu thẻ."}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="bg-destructive/10 border-destructive/30 flex items-center gap-2 rounded-lg border p-3 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Languages className="w-4 h-4 text-muted-foreground" />
                {t("admin.nameVi")}
                <span className="text-destructive">*</span>
              </label>
              <Input
                value={formNameVi}
                onChange={(e) => handleFormNameViChange(e.target.value)}
                placeholder="Ví dụ: Công nghệ"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Languages className="w-4 h-4 text-muted-foreground" />
                {t("admin.nameEn")}
                <span className="text-destructive">*</span>
              </label>
              <Input
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="E.g. Technology"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Hash className="w-4 h-4 text-muted-foreground" />
                {t("admin.slug")}
              </label>
              <Input
                value={formSlug}
                onChange={(e) => { setFormSlug(e.target.value); setFormSlugManuallyEdited(true) }}
                placeholder="technology"
              />
              <p className="text-xs text-muted-foreground">{t("admin.slugAutoGenerate")}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("admin.deleteTag")}</DialogTitle>
            <DialogDescription>{t("admin.deleteTagConfirm")}</DialogDescription>
          </DialogHeader>

          {deletingTag && (
            <div className="bg-muted/30 rounded-lg border border-border/50 p-4">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm">{deletingTag.name_vi}</p>
                  <p className="text-xs text-muted-foreground">{deletingTag.name_en}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="cursor-pointer">
              {t("admin.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
              className="cursor-pointer gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("admin.confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
