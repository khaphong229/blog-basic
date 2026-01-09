"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import Navigation from "./navigation"
import AdminPostForm from "./admin-post-form"
import AdminPostsList from "./admin-posts-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, FileText, PenLine, LayoutDashboard } from "lucide-react"

export default function AdminDashboard() {
  const { language, t } = useLanguage()
  const { posts } = useBlog()

  // Stats for dashboard overview
  const totalPosts = posts.length
  const recentPosts = posts.filter(
    (p) => new Date().getTime() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 pt-8 pb-24 md:pt-12 md:pb-32">
        {/* Page Header - Visual grouping */}
        <header className="mb-10 pb-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t("admin.dashboard")}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === "en"
                    ? "Manage your blog posts and content"
                    : "Quản lý các bài viết blog và nội dung của bạn"}
                </p>
              </div>
            </div>
            <Link href="/admin/settings">
              <Button 
                variant="outline" 
                className="gap-2 border-border bg-transparent hover:bg-muted transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                {language === "en" ? "Settings" : "Cài đặt"}
              </Button>
            </Link>
          </div>
        </header>

        {/* Quick Stats - Visual grouping with cards */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Posts Stat */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {language === "en" ? "Total Posts" : "Tổng bài viết"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
                </div>
              </div>
            </div>

            {/* Recent Posts Stat */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {language === "en" ? "This Week" : "Tuần này"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{recentPosts}</p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {language === "en" ? "Quick Action" : "Thao tác nhanh"}
                </p>
                <p className="text-sm text-foreground/80">
                  {language === "en" ? "Create a new post" : "Tạo bài viết mới"}
                </p>
              </div>
              <a href="#create-post">
                <Button size="sm" className="cursor-pointer">
                  <PenLine className="w-4 h-4 mr-2" />
                  {language === "en" ? "New" : "Tạo"}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content - Two sections */}
        <div className="space-y-16">
          {/* Create New Post Section */}
          <section id="create-post">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-primary" />
              <h2 className="text-xl md:text-2xl font-bold">
                {language === "en" ? "Create New Post" : "Tạo bài viết mới"}
              </h2>
            </div>
            <AdminPostForm />
          </section>

          {/* Visual Separator */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Posts List Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-secondary" />
                <h2 className="text-xl md:text-2xl font-bold">
                  {language === "en" ? "All Posts" : "Tất cả bài viết"}
                </h2>
                <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {posts.length}
                </span>
              </div>
            </div>
            <AdminPostsList posts={posts} />
          </section>
        </div>
      </main>
    </div>
  )
}
