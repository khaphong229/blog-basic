"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2, Terminal, Tag, Filter } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BlogCard } from "@/components/ui/blog-card"

interface BlogListingProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function BlogListing({ searchQuery, setSearchQuery }: BlogListingProps) {
  const { language, t } = useLanguage()
  const { searchPosts, getAllTags, getPostsByTag, isLoading, error } = useBlog()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    return getAllTags(language)
  }, [language, getAllTags])

  const filteredPosts = useMemo(() => {
    let results = selectedTag
      ? getPostsByTag(selectedTag, language)
      : searchPosts(searchQuery, language)

    if (selectedTag && searchQuery) {
      const searchResults = new Set(searchPosts(searchQuery, language).map((p) => p.id))
      results = results.filter((p) => searchResults.has(p.id))
    }

    return results
  }, [searchQuery, language, searchPosts, selectedTag, getPostsByTag])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">
          {language === "en" ? "Loading articles..." : "Đang tải bài viết..."}
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/5 rounded-xl border p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-2xl text-destructive">!</span>
        </div>
        <h3 className="text-destructive mb-2 font-semibold">
          {language === "en" ? "Unable to load content" : "Không thể tải nội dung"}
        </h3>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and filter section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border p-1 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-2 p-2">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t("blog.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-transparent bg-muted/30 focus-visible:bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tags filter toggle or list could go here if crowded, but fitting inline for now */}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="border-t border-border/50 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-muted-foreground py-1.5 mr-1">
                {language === "en" ? "Topics:" : "Chủ đề:"}
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium ${selectedTag === tag
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {tag}
                </button>
              ))}
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedTag(null)
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2"
                >
                  <Filter className="h-3 w-3" />
                  {language === "en" ? "Reset" : "Đặt lại"}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border-2 border-dashed border-border rounded-2xl"
        >
          <Search className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("blog.noResults")}
          </h3>
          <p className="text-muted-foreground text-sm">
            {language === "en"
              ? "Try adjusting your search terms or filters"
              : "Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc"}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} language={language} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Results count footer */}
      {filteredPosts.length > 0 && (
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-muted-foreground">
            {language === "en"
              ? `Showing ${filteredPosts.length} articles`
              : `Hiển thị ${filteredPosts.length} bài viết`}
          </p>
        </div>
      )}
    </div>
  )
}
