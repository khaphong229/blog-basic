"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { motion } from "framer-motion"
import Link from "next/link"
import { Settings, FileText, PenLine, Terminal, Activity, Database, Cpu } from "lucide-react"

import Navigation from "./navigation"
import AdminPostForm from "./admin-post-form"
import AdminPostsList from "./admin-posts-list"
import AdminComments from "./admin-comments"
import AnimatedGradientBackdrop from "./animated-gradient-backdrop"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { language, t } = useLanguage()
  const { posts } = useBlog()

  // Stats for dashboard overview
  const totalPosts = posts.length
  const recentPosts = posts.filter(
    (p) => new Date().getTime() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length

  const stats = [
    {
      label: language === "en" ? "Total Posts" : "Tổng bài viết",
      value: totalPosts,
      icon: FileText,
      color: "primary",
      command: "ls -la posts/",
    },
    {
      label: language === "en" ? "This Week" : "Tuần này",
      value: recentPosts,
      icon: PenLine,
      color: "secondary",
      command: "git log --since='1 week ago'",
    },
    {
      label: language === "en" ? "Status" : "Trạng thái",
      value: "ONLINE",
      icon: Activity,
      color: "primary",
      command: "systemctl status blog",
    },
  ]

  return (
    <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
      <AnimatedGradientBackdrop showMatrix={false} showGrid={true} showScanlines={true} />
      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-border bg-card/80 border backdrop-blur-sm">
            {/* Terminal header */}
            <div className="border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="bg-destructive/80 h-3 w-3 rounded-full" />
                <div className="bg-accent/80 h-3 w-3 rounded-full" />
                <div className="bg-primary/80 h-3 w-3 rounded-full" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-muted-foreground font-mono text-xs">
                  admin@blog:~/dashboard — bash
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-muted-foreground mb-2 flex items-center gap-2 font-mono text-xs">
                    <span className="text-primary">$</span>
                    <span>whoami</span>
                  </div>
                  <h1 className="text-foreground font-mono text-2xl font-bold md:text-3xl">
                    <span className="text-primary">&gt;</span> {t("admin.dashboard")}
                  </h1>
                  <p className="text-muted-foreground mt-2 font-mono text-sm">
                    <span className="text-secondary">//</span>{" "}
                    {language === "en"
                      ? "Manage your blog posts and content"
                      : "Quản lý các bài viết blog và nội dung của bạn"}
                  </p>
                </div>
                <Link href="/admin/settings">
                  <Button variant="outline" className="gap-2 font-mono text-xs">
                    <Settings className="h-4 w-4" />
                    {language === "en" ? "config" : "cấu hình"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="border-border bg-card/80 hover:border-primary/50 border backdrop-blur-sm transition-colors"
              >
                {/* Mini terminal header */}
                <div className="border-border bg-muted/20 flex items-center gap-2 border-b px-3 py-2">
                  <stat.icon
                    className={`h-3 w-3 ${stat.color === "primary" ? "text-primary" : "text-secondary"}`}
                  />
                  <span className="text-muted-foreground truncate font-mono text-[10px]">
                    {stat.command}
                  </span>
                </div>
                {/* Stat content */}
                <div className="p-4">
                  <p className="text-muted-foreground mb-1 font-mono text-xs">{stat.label}</p>
                  <p
                    className={`font-mono text-2xl font-bold ${stat.color === "primary" ? "text-primary" : "text-secondary"}`}
                  >
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Create New Post Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            id="create-post"
          >
            <div className="border-border bg-card/80 border backdrop-blur-sm">
              {/* Section header */}
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <PenLine className="text-primary h-4 w-4" />
                  <span className="text-foreground font-mono text-sm font-semibold">
                    {language === "en" ? "new-post.sh" : "bai-viet-moi.sh"}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono text-xs">
                  <span className="text-primary">$</span> vim new-post.md
                </span>
              </div>
              <div className="p-6">
                <AdminPostForm />
              </div>
            </div>
          </motion.section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
            <Database className="text-muted-foreground h-4 w-4" />
            <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
          </div>

          {/* Comment Moderation Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <AdminComments />
          </motion.section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
            <Database className="text-muted-foreground h-4 w-4" />
            <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
          </div>

          {/* Posts List Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-border bg-card/80 border backdrop-blur-sm">
              {/* Section header */}
              <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-secondary h-4 w-4" />
                  <span className="text-foreground font-mono text-sm font-semibold">
                    {language === "en" ? "posts.db" : "bai-viet.db"}
                  </span>
                  <span className="text-muted-foreground bg-muted px-2 py-0.5 font-mono text-xs">
                    {posts.length}
                  </span>
                </div>
                <span className="text-muted-foreground font-mono text-xs">
                  <span className="text-primary">$</span> SELECT * FROM posts
                </span>
              </div>
              <div className="p-6">
                <AdminPostsList posts={posts} />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-border mt-12 border-t pt-6"
        >
          <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" />
              <span>
                System Status: <span className="text-primary">OK</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" />
              <span className="text-primary">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}
