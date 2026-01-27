"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
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
    if (
      !title.trim() ||
      !excerpt.trim() ||
      !content.trim() ||
      !author.trim() ||
      tags.length === 0
    ) {
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
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">{t("admin.title")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {language === "en" ? "Author" : "Tác giả"}
            </label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
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
            <Button onClick={handleSave} disabled={tags.length === 0 || isSubmitting}>
              {isSubmitting ? (language === "en" ? "Saving..." : "Đang lưu...") : t("admin.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
