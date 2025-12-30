"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminEditPostDialog from "./admin-edit-post-dialog"
import { useState } from "react"

interface AdminPostsListProps {
  posts: BlogPost[]
}

export default function AdminPostsList({ posts }: AdminPostsListProps) {
  const { language, t } = useLanguage()
  const { deletePost } = useBlog()
  const [editingPostId, setEditingPostId] = useState<string | null>(null)

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{language === "en" ? "No posts yet" : "Chưa có bài viết nào"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription>
                  {t("blog.by")} {post.author} •{" "}
                  {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN")}
                </CardDescription>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {post.language === "en" ? "EN" : "VI"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex gap-2">
              <AdminEditPostDialog post={post} onEdit={() => setEditingPostId(post.id)} />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(language === "en" ? "Delete this post?" : "Xóa bài viết này?")) {
                    deletePost(post.id)
                  }
                }}
              >
                {t("admin.delete")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
