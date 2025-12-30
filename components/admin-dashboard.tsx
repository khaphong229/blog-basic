"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import Navigation from "./navigation"
import AdminPostForm from "./admin-post-form"
import AdminPostsList from "./admin-posts-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { language, t } = useLanguage()
  const { posts } = useBlog()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("admin.dashboard")}</h1>
            <p className="text-muted-foreground">
              {language === "en"
                ? "Manage your blog posts and content"
                : "Quản lý các bài viết blog và nội dung của bạn"}
            </p>
          </div>
          <Link href="/admin/settings">
            <Button variant="outline" className="border-border bg-transparent">
              {language === "en" ? "Settings" : "Cài đặt"}
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Create New Post Section - Full Width */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{language === "en" ? "Create New Post" : "Tạo bài viết mới"}</h2>
            <AdminPostForm />
          </div>

          {/* Posts List Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {language === "en" ? "All Posts" : "Tất cả bài viết"} ({posts.length})
            </h2>
            <AdminPostsList posts={posts} />
          </div>
        </div>
      </main>
    </div>
  )
}
