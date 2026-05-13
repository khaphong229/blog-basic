"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import RichTextEditor from "./rich-text-editor"
import AuthorSelect from "@/components/author-select"
import AdminPostResources from "./admin/admin-post-resources"
import { createClient } from "@/lib/supabase/client"
import { FileText, Package } from "lucide-react"

interface AdminEditPostDialogProps {
  post: BlogPost
  onEdit: () => void
}

export default function AdminEditPostDialog({ post, onEdit }: AdminEditPostDialogProps) {
  const { language, t } = useLanguage()
  const { updatePost } = useBlog()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [excerpt, setExcerpt] = useState(post.excerpt)
  const [content, setContent] = useState(post.content)
  const [author, setAuthor] = useState(post.author)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(post.tags)
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"edit" | "resources">("edit")

  /** Load existing tags from DB on mount */
  useEffect(() => {
    const loadTags = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from("tags").select("slug")
        if (data) setExistingTags((data as { slug: string }[]).map((t) => t.slug))
      } catch (err) {
        console.error("Failed to load tags:", err)
      }
    }
    loadTags()
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await updatePost(post.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        author: author.trim(),
        tags,
      })

      setOpen(false)
      onEdit()
    } catch (error) {
      console.error("Error updating post:", error)
      alert(language === "en" ? "Failed to update post" : "Không thể cập nhật bài viết")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle(post.title)
    setExcerpt(post.excerpt)
    setContent(post.content)
    setAuthor(post.author)
    setTags(post.tags)
    setTagInput("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setActiveTab("edit") }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("admin.edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("admin.edit")}</DialogTitle>
          <DialogDescription>
            {language === "en" ? "Edit your blog post" : "Chỉnh sửa bài viết blog của bạn"}
          </DialogDescription>
        </DialogHeader>

        {/* Tab navigation */}
        <div className="flex gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
              activeTab === "edit"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            {language === "en" ? "Content" : "Nội dung"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("resources")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer",
              activeTab === "resources"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Package className="h-4 w-4" />
            {language === "en" ? "Resources" : "Tài nguyên"}
          </button>
        </div>

        {activeTab === "edit" ? (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">{t("admin.title")}</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {language === "en" ? "Author" : "Tác giả"}
              </label>
              <AuthorSelect
                value={author}
                onChange={setAuthor}
                placeholder={language === "en" ? "Select author..." : "Chọn tác giả..."}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {language === "en" ? "Excerpt" : "Tóm tắt"}
              </label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">{t("admin.content")}</label>
              <RichTextEditor value={content} onChange={setContent} rows={6} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                {language === "en" ? "Tags" : "Thẻ"}
              </label>
              <div className="mb-2 flex gap-2">
                <Input
                  placeholder={language === "en" ? "Add a tag" : "Thêm thẻ"}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  {language === "en" ? "Add" : "Thêm"}
                </Button>
              </div>
              {/* Tag suggestions */}
              {existingTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {existingTags
                    .filter((t) => !tags.includes(t))
                    .slice(0, 10)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setTags([...tags, tag])}
                        className="bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-full px-2 py-0.5 text-xs text-muted-foreground transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded px-2 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary/80"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                {t("admin.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting
                  ? language === "en"
                    ? "Saving..."
                    : post.language === "vi" && post.linkedPostId
                      ? "Đang lưu & Dịch..."
                      : "Đang lưu..."
                  : t("admin.save")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <AdminPostResources postId={post.id} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
