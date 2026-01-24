"use client"

import type React from "react"
import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageCircle,
  CheckCircle,
  Loader2,
  Terminal,
  User,
  Mail,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CommentsSectionProps {
  post: BlogPost
}

export default function CommentsSection({ post }: CommentsSectionProps) {
  const { language, t } = useLanguage()
  const { addComment } = useBlog()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !comment.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await addComment(post.id, {
        name: name.trim(),
        email: email.trim(),
        content: comment.trim(),
      })

      setName("")
      setEmail("")
      setComment("")
      setSubmitted(true)

      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error("Error adding comment:", err)
      setError(
        language === "en"
          ? "Failed to add comment. Please try again."
          : "Không thể thêm bình luận. Vui lòng thử lại."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-12">
      {/* Section divider */}
      <div className="mb-8 flex items-center gap-4">
        <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
        <MessageCircle className="text-muted-foreground h-5 w-5" />
        <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
      </div>

      {/* Comments terminal window */}
      <div className="border-border bg-card/80 border backdrop-blur-sm">
        {/* Terminal header */}
        <div className="border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="bg-destructive/80 h-3 w-3 rounded-full" />
            <div className="bg-accent/80 h-3 w-3 rounded-full" />
            <div className="bg-primary/80 h-3 w-3 rounded-full" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2">
            <MessageSquare className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground font-mono text-xs">
              comments.log — {post.comments.length} entries
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Section header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground font-mono text-lg font-bold">
              <span className="text-primary">&gt;</span> {t("blog.comments")}
            </h2>
            <span className="text-muted-foreground bg-muted px-2 py-1 font-mono text-xs">
              {post.comments.length} {language === "en" ? "responses" : "phản hồi"}
            </span>
          </div>

          {/* Comments List */}
          <div className="mb-8 space-y-4">
            {post.comments.length === 0 ? (
              <div className="border-border bg-muted/20 border p-8 text-center">
                <Terminal className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                <p className="text-muted-foreground font-mono text-sm">
                  <span className="text-primary">$</span>{" "}
                  {language === "en"
                    ? "No comments yet. Be the first!"
                    : "Chưa có bình luận. Hãy là người đầu tiên!"}
                </p>
              </div>
            ) : (
              post.comments.map((c, index) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-primary/30 hover:border-primary/60 border-l-2 pl-4 transition-colors"
                >
                  {/* Comment header */}
                  <div className="mb-2 flex items-start gap-3">
                    {/* Avatar */}
                    <div className="border-secondary/50 bg-secondary/10 text-secondary flex h-8 w-8 items-center justify-center border font-mono text-sm font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-foreground font-semibold">{c.name}</span>
                        <span className="text-muted-foreground">
                          {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Comment content */}
                      <p className="text-foreground/80 mt-2 font-mono text-sm leading-relaxed">
                        <span className="text-muted-foreground/50">// </span>
                        {c.content}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          {/* Comment Form */}
          <div className="border-border bg-muted/20 border p-6">
            <div className="mb-4">
              <h3 className="text-foreground mb-1 font-mono text-sm font-semibold">
                <span className="text-primary">$</span> {t("blog.leaveComment")}
              </h3>
              <p className="text-muted-foreground font-mono text-xs">
                <span className="text-secondary">//</span>{" "}
                {language === "en"
                  ? "Your email will not be published"
                  : "Email của bạn sẽ không được công khai"}
              </p>
            </div>

            {/* Success message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-primary/50 bg-primary/10 mb-4 flex items-center gap-3 border p-4"
              >
                <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                <p className="text-primary font-mono text-sm">
                  {language === "en" ? "Comment added successfully!" : "Bình luận đã được thêm!"}
                </p>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <div className="border-destructive/50 bg-destructive/10 mb-4 border p-4">
                <p className="text-destructive font-mono text-sm">
                  <span className="text-destructive/70">[ERROR]</span> {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                    <User className="h-3 w-3" />
                    {t("blog.yourName")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder={language === "en" ? "John Doe" : "Nguyễn Văn A"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                    <Mail className="h-3 w-3" />
                    {t("blog.yourEmail")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder={language === "en" ? "you@example.com" : "ban@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <MessageSquare className="h-3 w-3" />
                  {t("blog.comment")} <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder={
                    language === "en" ? "Write your thoughts..." : "Viết suy nghĩ của bạn..."
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "en" ? "Submitting..." : "Đang gửi..."}
                  </>
                ) : (
                  <>
                    <span className="mr-1">&gt;</span>
                    {t("blog.submit")}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Terminal footer */}
          <div className="border-border mt-4 border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5" />
              <span className="text-primary">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
