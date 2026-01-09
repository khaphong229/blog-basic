"use client"

import type React from "react"
import RichTextEditor from "./rich-text-editor"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { X, Plus, Send, FileText, User, AlignLeft, Tag } from "lucide-react"

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
    <Card className="border-border/50 shadow-sm overflow-hidden">
      {/* Header with subtle accent */}
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{t("admin.newPost")}</CardTitle>
            <CardDescription className="text-sm">
              {language === "en" 
                ? "Fill in the details to create a new blog post" 
                : "Điền thông tin để tạo bài viết mới"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field - Full Width, Primary Focus */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="w-4 h-4 text-muted-foreground" />
              {t("admin.title")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder={language === "en" ? "Enter a compelling title..." : "Nhập tiêu đề hấp dẫn..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 text-base font-medium border-border/70 focus:border-primary"
            />
          </div>

          {/* Two Column Layout - Author & Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="w-4 h-4 text-muted-foreground" />
                {language === "en" ? "Author" : "Tác giả"}
                <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={language === "en" ? "Your name" : "Tên của bạn"}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="h-11 border-border/70 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                {language === "en" ? "Excerpt" : "Tóm tắt"}
                <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={language === "en" ? "Brief summary for preview" : "Tóm tắt ngắn để xem trước"}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="h-11 border-border/70 focus:border-primary"
              />
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {t("admin.content")}
              <span className="text-destructive">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={language === "en" ? "Write your post content here..." : "Viết nội dung bài viết ở đây..."}
              rows={12}
            />
          </div>

          {/* Tags Field */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {language === "en" ? "Tags" : "Thẻ"}
              <span className="text-destructive">*</span>
            </label>
            
            <div className="flex gap-2">
              <Input
                placeholder={language === "en" ? "Add a tag and press Enter" : "Thêm thẻ và nhấn Enter"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="h-11 border-border/70 focus:border-primary"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                className="h-11 px-4 border-border/70 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === "en" ? "Add" : "Thêm"}
              </Button>
            </div>

            {/* Tags Display */}
            <div className="min-h-[44px] p-3 rounded-lg bg-muted/30 border border-border/50">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "At least one tag is required" : "Cần ít nhất một thẻ"}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full font-medium transition-colors hover:bg-primary/15"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border/50">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold cursor-pointer"
              disabled={isSubmitting || tags.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {language === "en" ? "Publishing..." : "Đang xuất bản..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("admin.save")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
