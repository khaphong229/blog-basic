"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, FileText, PenLine, TrendingUp, LogOut, MessageSquare } from "lucide-react"

import Navigation from "./navigation"
import AdminPostForm from "./admin-post-form"
import AdminPostsList from "./admin-posts-list"
import AdminComments from "./admin-comments"
import Footer from "./footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

/**
 * Admin Dashboard — clean modern SaaS-style layout.
 * Features: stats overview, post creation form, comments moderation, posts list.
 */
export default function AdminDashboard() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const { posts } = useBlog()

  /** Sign out and redirect to login */
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  /** Stats for dashboard overview */
  const totalPosts = posts.length
  const recentPosts = posts.filter(
    (p) => new Date().getTime() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length

  const stats = [
    {
      label: language === "en" ? "Total Posts" : "Tổng bài viết",
      value: totalPosts,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: language === "en" ? "This Week" : "Tuần này",
      value: recentPosts,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: language === "en" ? "Status" : "Trạng thái",
      value: "ONLINE",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {t("admin.dashboard")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {language === "en"
                  ? "Manage your blog posts and content"
                  : "Quản lý các bài viết blog và nội dung của bạn"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/settings">
                <Button variant="outline" size="sm" className="gap-2 rounded-lg text-sm">
                  <Settings className="h-4 w-4" />
                  {language === "en" ? "Settings" : "Cài đặt"}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg text-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {language === "en" ? "Logout" : "Đăng xuất"}
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="space-y-10">
          {/* Create New Post Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            id="create-post"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <PenLine className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {language === "en" ? "New Post" : "Bài viết mới"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "Fill in the details to create a new blog post" : "Điền thông tin để tạo bài viết mới"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AdminPostForm />
              </div>
            </div>
          </motion.section>

          {/* Comment Moderation Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <AdminComments />
          </motion.section>

          {/* Posts List Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {language === "en" ? "All Posts" : "Tất cả bài viết"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {posts.length} {language === "en" ? "posts total" : "bài viết"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AdminPostsList posts={posts} />
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
