"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { Button } from "@/components/ui/button"
import AdminEditPostDialog from "./admin-edit-post-dialog"
import { useState } from "react"
import { FileText, Trash2, Calendar, User, Globe } from "lucide-react"

interface AdminPostsListProps {
  posts: BlogPost[]
}

export default function AdminPostsList({ posts }: AdminPostsListProps) {
  const { language, t } = useLanguage()
  const { deletePost } = useBlog()
  const [editingPostId, setEditingPostId] = useState<string | null>(null)

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl bg-muted/20 border border-border/50">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">
          {language === "en" ? "No posts yet" : "Chưa có bài viết nào"}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          {language === "en" 
            ? "Create your first post using the form above" 
            : "Tạo bài viết đầu tiên bằng form ở trên"}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* Table Header */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-5">{language === "en" ? "Title" : "Tiêu đề"}</div>
        <div className="col-span-2">{language === "en" ? "Author" : "Tác giả"}</div>
        <div className="col-span-2">{language === "en" ? "Date" : "Ngày"}</div>
        <div className="col-span-1">{language === "en" ? "Lang" : "NN"}</div>
        <div className="col-span-2 text-right">{language === "en" ? "Actions" : "Thao tác"}</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="group px-6 py-4 hover:bg-muted/20 transition-colors"
          >
            {/* Desktop Row */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
              {/* Title & Excerpt */}
              <div className="col-span-5">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {post.excerpt}
                </p>
              </div>

              {/* Author */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-[10px] font-medium text-primary">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-foreground/80 truncate">{post.author}</span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">
                  {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Language Badge */}
              <div className="col-span-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {post.language === "en" ? "EN" : "VI"}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-2">
                <AdminEditPostDialog post={post} onEdit={() => setEditingPostId(post.id)} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={() => {
                    if (confirm(language === "en" ? "Delete this post?" : "Xóa bài viết này?")) {
                      deletePost(post.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Card */}
            <div className="md:hidden space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {post.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                  {post.language === "en" ? "EN" : "VI"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <AdminEditPostDialog post={post} onEdit={() => setEditingPostId(post.id)} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={() => {
                    if (confirm(language === "en" ? "Delete this post?" : "Xóa bài viết này?")) {
                      deletePost(post.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("admin.delete")}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
