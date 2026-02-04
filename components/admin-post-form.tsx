"use client"

import type React from "react"
import RichTextEditor from "./rich-text-editor"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { X, Plus, Send, FileText, User, AlignLeft, Tag, AlertCircle, Languages, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
// import { translatePost } from "@/lib/api/translation" // Moved to context

export default function AdminPostForm() {
  const { language, t } = useLanguage()
  const { addPost } = useBlog()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])


  const handleAddTag = () => {
    const normalizedTag = tagInput.trim().toLowerCase().replace(/\s+/g, "-")
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (
      !title.trim() ||
      !excerpt.trim() ||
      !content.trim() ||
      !author.trim() ||
      tags.length === 0
    ) {
      setError(
        language === "en"
          ? "Please fill in all required fields"
          : "Vui lòng điền đầy đủ các trường bắt buộc"
      )
      return
    }

    setIsSubmitting(true)

    try {
      await addPost({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        author: author.trim(),
        language,
        tags,
        status: "published",
      })

      // Determine success message
      const createdBoth = language === "vi"
      setSuccessMessage(
        createdBoth
          ? "Đã tạo thành công cả bài viết tiếng Việt và tiếng Anh!"
          : language === "en"
            ? "Post created successfully!"
            : "Đã tạo bài viết thành công!"
      )

      // Reset form
      setTitle("")
      setExcerpt("")
      setContent("")
      setAuthor("")
      setTags([])
      setSuccess(true)

      // Hide success message after 4 seconds (slightly longer for dual-post message)
      setTimeout(() => {
        setSuccess(false)
        setSuccessMessage(null)
      }, 4000)
    } catch (err) {
      console.error("Error creating post:", err)
      setError(
        language === "en"
          ? "Failed to create post. Please try again."
          : "Không thể tạo bài viết. Vui lòng thử lại."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/50 overflow-hidden shadow-sm">
      {/* Header with subtle accent */}
      <CardHeader className="from-primary/5 via-primary/3 border-border/50 border-b bg-gradient-to-r to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <FileText className="text-primary h-5 w-5" />
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
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border-destructive/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
            <AlertCircle className="text-destructive h-5 w-5 flex-shrink-0" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-primary/10 border-primary/30 mb-6 flex items-center gap-3 rounded-xl border p-4">
            <Send className="text-primary h-5 w-5 flex-shrink-0" />
            <p className="text-primary font-medium">
              {successMessage || (language === "en" ? "Post created successfully!" : "Đã tạo bài viết thành công!")}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field - Full Width, Primary Focus */}
          <div className="space-y-2">
            <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <FileText className="text-muted-foreground h-4 w-4" />
              {t("admin.title")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder={
                language === "en" ? "Enter a compelling title..." : "Nhập tiêu đề hấp dẫn..."
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="border-border/70 focus:border-primary h-12 text-base font-medium"
            />
          </div>

          {/* Two Column Layout - Author & Excerpt */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <User className="text-muted-foreground h-4 w-4" />
                {language === "en" ? "Author" : "Tác giả"}
                <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={language === "en" ? "Your name" : "Tên của bạn"}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                disabled={isSubmitting}
                className="border-border/70 focus:border-primary h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <AlignLeft className="text-muted-foreground h-4 w-4" />
                {language === "en" ? "Excerpt" : "Tóm tắt"}
                <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder={
                  language === "en" ? "Brief summary for preview" : "Tóm tắt ngắn để xem trước"
                }
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                disabled={isSubmitting}
                className="border-border/70 focus:border-primary h-11"
              />
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
              {t("admin.content")}
              <span className="text-destructive">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={
                language === "en"
                  ? "Write your post content here..."
                  : "Viết nội dung bài viết ở đây..."
              }
              rows={12}
            />
          </div>

          {/* Tags Field */}
          <div className="space-y-3">
            <label className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <Tag className="text-muted-foreground h-4 w-4" />
              {language === "en" ? "Tags" : "Thẻ"}
              <span className="text-destructive">*</span>
            </label>

            <div className="flex gap-2">
              <Input
                placeholder={
                  language === "en" ? "Add a tag and press Enter" : "Thêm thẻ và nhấn Enter"
                }
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                disabled={isSubmitting}
                className="border-border/70 focus:border-primary h-11"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={isSubmitting}
                className="border-border/70 h-11 cursor-pointer px-4"
              >
                <Plus className="mr-1 h-4 w-4" />
                {language === "en" ? "Add" : "Thêm"}
              </Button>
            </div>

            {/* Tags Display */}
            <div className="bg-muted/30 border-border/50 min-h-[44px] rounded-lg border p-3">
              {tags.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {language === "en" ? "At least one tag is required" : "Cần ít nhất một thẻ"}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary hover:bg-primary/15 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                        className="hover:bg-primary/20 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Auto-translate Info (only for Vietnamese posts) */}
          {language === "vi" && (
            <div className="bg-muted/30 border-border/50 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                  <Languages className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Tiếng Anh sẽ được tạo tự động
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Hệ thống sẽ dùng AI để dịch và tạo bài viết tiếng Anh song song.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="border-border/50 border-t pt-4">
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full cursor-pointer px-8 text-base font-semibold sm:w-auto"
              disabled={isSubmitting || tags.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en" ? "Publishing..." : "Đang xuất bản & Dịch..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
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
