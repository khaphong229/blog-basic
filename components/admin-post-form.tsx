"use client"

import type React from "react"
import RichTextEditor from "./rich-text-editor"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPostForm() {
  const { language, t } = useLanguage()
  const { addPost } = useBlog()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !excerpt.trim() || !content.trim() || !author.trim() || tags.length === 0) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      addPost({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        author: author.trim(),
        language: "en",
        tags,
      })

      setTitle("")
      setExcerpt("")
      setContent("")
      setAuthor("")
      setTags([])
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle>{t("admin.newPost")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">{t("admin.title")}</label>
            <Input
              placeholder={language === "en" ? "Post title" : "Tiêu đề bài viết"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">{language === "en" ? "Author" : "Tác giả"}</label>
              <Input
                placeholder={language === "en" ? "Your name" : "Tên của bạn"}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">{language === "en" ? "Excerpt" : "Tóm tắt"}</label>
              <Input
                placeholder={language === "en" ? "Brief summary" : "Tóm tắt ngắn"}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">{t("admin.content")}</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={language === "en" ? "Your post content" : "Nội dung bài viết của bạn"}
              rows={12}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">{language === "en" ? "Tags" : "Thẻ"}</label>
            <div className="flex gap-2 mb-3">
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
                className="h-10 text-base"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                {language === "en" ? "Add" : "Thêm"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-2 hover:bg-primary/20 transition"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary/80 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {tags.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {language === "en" ? "At least one tag is required" : "Cần ít nhất một thẻ"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-base font-semibold"
            disabled={isSubmitting || tags.length === 0}
          >
            {isSubmitting ? (language === "en" ? "Publishing..." : "Đang xuất bản...") : t("admin.save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
