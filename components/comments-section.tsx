"use client"

import type React from "react"
import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, CheckCircle } from "lucide-react"

interface CommentsSectionProps {
  post: BlogPost
}

export default function CommentsSection({ post }: CommentsSectionProps) {
  const { language, t } = useLanguage()
  const { addComment } = useBlog()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !comment.trim()) {
      return
    }

    addComment(post.id, {
      name: name.trim(),
      email: email.trim(),
      content: comment.trim(),
    })

    setName("")
    setEmail("")
    setComment("")
    setSubmitted(true)

    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="mt-20">
      {/* Visual separator - decorative break */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <MessageCircle className="w-6 h-6 text-muted-foreground/50" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Comments container with distinct background */}
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-serif">
            {t("blog.comments")}
          </h2>
          <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {post.comments.length} {language === "en" ? "responses" : "phản hồi"}
          </span>
        </div>

        {/* Comments List */}
        <div className="space-y-6 mb-12">
          {post.comments.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-muted/30 border border-border/50">
              <MessageCircle className="w-10 h-10 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-muted-foreground">
                {language === "en"
                  ? "No comments yet. Be the first to comment!"
                  : "Chưa có bình luận nào. Hãy là người đầu tiên!"}
              </p>
            </div>
          ) : (
            post.comments.map((c) => (
              <article 
                key={c.id}
                className="group relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:to-transparent before:rounded-full"
              >
                {/* Comment header */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/40 flex items-center justify-center text-secondary font-medium text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-semibold text-foreground">
                        {c.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    
                    {/* Comment content */}
                    <p className="mt-2 text-foreground/85 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Comment Form - distinct container */}
        <div className="bg-gradient-to-b from-muted/50 to-muted/20 rounded-2xl p-6 md:p-8 border border-border/50">
          <h3 className="text-xl font-semibold mb-2">
            {t("blog.leaveComment")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {language === "en" 
              ? "Your email address will not be published." 
              : "Email của bạn sẽ không được công khai."}
          </p>

          {/* Success message */}
          {submitted && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-primary font-medium">
                {language === "en" ? "Thank you for your comment!" : "Cảm ơn bạn đã bình luận!"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  {t("blog.yourName")} <span className="text-destructive">*</span>
                </label>
                <Input 
                  placeholder={language === "en" ? "John Doe" : "Nguyễn Văn A"}
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  {t("blog.yourEmail")} <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder={language === "en" ? "you@example.com" : "ban@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                {t("blog.comment")} <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder={language === "en" ? "Write your thoughts..." : "Viết suy nghĩ của bạn..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                className="bg-background/50 resize-none"
              />
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto cursor-pointer">
              {t("blog.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
