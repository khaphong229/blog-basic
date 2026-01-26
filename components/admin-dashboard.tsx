"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import Navigation from "./navigation"
import AdminPostForm from "./admin-post-form"
import AdminPostsList from "./admin-posts-list"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Settings,
  FileText,
  PenLine,
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
} from "lucide-react"

export default function AdminDashboard() {
  const { language, t } = useLanguage()
  const { posts } = useBlog()

  // Stats for dashboard overview
  const totalPosts = posts.length
  const recentPosts = posts.filter(
    (p) => new Date().getTime() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0)

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <AnimatedGradientBackdrop />
      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-8 pb-24 md:pt-12 md:pb-32">
        {/* Page Header */}
        <header className="border-border/50 mb-10 border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="from-primary/20 to-primary/5 border-primary/20 shadow-primary/5 flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-lg">
                <LayoutDashboard className="text-primary h-7 w-7" />
              </div>
              <div>
                <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
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
                className="border-border/50 bg-card/50 hover:bg-card gap-2 rounded-xl backdrop-blur-sm transition-all"
              >
                <Settings className="h-4 w-4" />
                {language === "en" ? "Settings" : "Cài đặt"}
              </Button>
            </Link>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Posts Stat */}
            <div className="group bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-soft rounded-2xl border p-6 backdrop-blur-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <FileText className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {language === "en" ? "Total Posts" : "Tổng bài viết"}
                  </p>
                  <p className="text-foreground text-3xl font-bold">{totalPosts}</p>
                </div>
              </div>
            </div>

            {/* Recent Posts Stat */}
            <div className="group bg-card/50 border-border/50 hover:border-secondary/30 hover:shadow-soft rounded-2xl border p-6 backdrop-blur-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <TrendingUp className="text-secondary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {language === "en" ? "This Week" : "Tuần này"}
                  </p>
                  <p className="text-foreground text-3xl font-bold">{recentPosts}</p>
                </div>
              </div>
            </div>

            {/* Comments Stat */}
            <div className="group bg-card/50 border-border/50 hover:border-accent/30 hover:shadow-soft rounded-2xl border p-6 backdrop-blur-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                  <MessageSquare className="text-accent h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {language === "en" ? "Comments" : "Bình luận"}
                  </p>
                  <p className="text-foreground text-3xl font-bold">{totalComments}</p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="from-primary/5 to-secondary/5 border-primary/20 flex items-center justify-between rounded-2xl border bg-gradient-to-br p-6">
              <div>
                <p className="text-muted-foreground mb-1 text-sm font-medium">
                  {language === "en" ? "Quick Action" : "Thao tác nhanh"}
                </p>
                <p className="text-foreground/80 text-sm">
                  {language === "en" ? "Create a new post" : "Tạo bài viết mới"}
                </p>
              </div>
              <a href="#create-post">
                <Button size="sm" className="shadow-primary/20 rounded-xl shadow-md">
                  <PenLine className="mr-2 h-4 w-4" />
                  {language === "en" ? "New" : "Tạo"}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Create New Post Section */}
          <section id="create-post" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="from-primary to-primary/50 h-8 w-1.5 rounded-full bg-gradient-to-b" />
              <h2 className="text-xl font-bold md:text-2xl">
                {language === "en" ? "Create New Post" : "Tạo bài viết mới"}
              </h2>
            </div>
            <div className="bg-card/50 border-border/50 rounded-2xl border p-6 backdrop-blur-sm md:p-8">
              <AdminPostForm />
            </div>
          </section>

          {/* Visual Separator */}
          <div className="flex items-center gap-4">
            <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
          </div>

          {/* Posts List Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="from-secondary to-secondary/50 h-8 w-1.5 rounded-full bg-gradient-to-b" />
                <h2 className="text-xl font-bold md:text-2xl">
                  {language === "en" ? "All Posts" : "Tất cả bài viết"}
                </h2>
                <span className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1 text-sm">
                  {posts.length}
                </span>
              </div>
            </div>
            <div className="bg-card/50 border-border/50 rounded-2xl border p-6 backdrop-blur-sm md:p-8">
              <AdminPostsList posts={posts} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
