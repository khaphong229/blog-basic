"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Eye, EyeOff, Trash2, AlertCircle } from "lucide-react"
import { getAllComments, updateCommentStatus, deleteComment } from "@/lib/api/comments"
import type { Comment } from "@/lib/supabase"

type CommentWithPost = Comment & { post_title?: string }

export default function AdminComments() {
  const { language } = useLanguage()
  const [comments, setComments] = useState<CommentWithPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllComments()
      setComments(data)
    } catch (err) {
      console.error("Error fetching comments:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch comments")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "visible" ? "hidden" : "visible"
      await updateCommentStatus(id, newStatus)
      await fetchComments()
    } catch (err) {
      console.error("Error updating comment status:", err)
      alert(language === "en" ? "Failed to update comment" : "Không thể cập nhật bình luận")
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        language === "en" ? "Delete this comment permanently?" : "Xóa bình luận này vĩnh viễn?"
      )
    ) {
      return
    }

    try {
      await deleteComment(id)
      await fetchComments()
    } catch (err) {
      console.error("Error deleting comment:", err)
      alert(language === "en" ? "Failed to delete comment" : "Không thể xóa bình luận")
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="border-primary inline-block h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground mt-4">
          {language === "en" ? "Loading comments..." : "Đang tải bình luận..."}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <MessageSquare className="text-muted-foreground/40 mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground font-medium">
            {language === "en" ? "No comments yet" : "Chưa có bình luận nào"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="mb-2 flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
          <MessageSquare className="text-primary h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {language === "en" ? "Comment Moderation" : "Quản lý bình luận"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {language === "en"
              ? "Manage and moderate user comments"
              : "Quản lý và kiểm duyệt bình luận"}
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className={comment.status === "hidden" ? "border-dashed opacity-60" : ""}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    {comment.author_name}
                    {comment.status === "hidden" && (
                      <span className="bg-muted text-muted-foreground inline-flex items-center rounded px-2 py-0.5 text-xs font-medium">
                        {language === "en" ? "Hidden" : "Đã ẩn"}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {comment.author_email} •{" "}
                    {new Date(comment.created_at).toLocaleString(
                      language === "en" ? "en-US" : "vi-VN"
                    )}
                    {comment.post_title && (
                      <>
                        {" • "}
                        <span className="font-medium">{comment.post_title}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(comment.id, comment.status)}
                    className="cursor-pointer"
                  >
                    {comment.status === "visible" ? (
                      <>
                        <EyeOff className="mr-1 h-4 w-4" />
                        {language === "en" ? "Hide" : "Ẩn"}
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 h-4 w-4" />
                        {language === "en" ? "Show" : "Hiện"}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-foreground/80 text-sm whitespace-pre-wrap">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
