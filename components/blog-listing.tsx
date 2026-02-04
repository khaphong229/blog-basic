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
        <div className="border-border bg-card/80 border p-8 text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground font-mono text-sm">
            <span className="text-primary">$</span>{" "}
            {language === "en" ? "Loading posts..." : "Đang tải bài viết..."}
            <span className="animate-pulse">_</span>
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="border-destructive/50 bg-destructive/10 border p-6 text-center">
        <Terminal className="text-destructive mx-auto mb-4 h-8 w-8" />
        <p className="text-destructive mb-2 font-mono text-sm">
          <span className="text-destructive/70">[ERROR]</span>{" "}
          {language === "en" ? "Failed to load posts" : "Không thể tải bài viết"}
        </p>
        <p className="text-muted-foreground font-mono text-xs">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and filter section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-border bg-card/50 border backdrop-blur-sm"
      >
        {/* Terminal header */}
        <div className="border-border bg-muted/30 flex items-center gap-2 border-b px-4 py-2">
          <div className="flex items-center gap-1.5">
            <div className="bg-destructive/60 h-2.5 w-2.5 rounded-full" />
            <div className="bg-accent/60 h-2.5 w-2.5 rounded-full" />
            <div className="bg-primary/60 h-2.5 w-2.5 rounded-full" />
          </div>
          <div className="flex flex-1 items-center justify-center gap-2">
            <Filter className="text-muted-foreground h-3 w-3" />
            <span className="text-muted-foreground font-mono text-xs">search.sh</span>
          </div>
        </div>

        {/* Search content */}
        <div className="space-y-4 p-4">
          {/* Search input */}
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono text-sm">$</span>
            <span className="text-muted-foreground font-mono text-sm">grep -i</span>
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder={t("blog.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
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
          </div>

          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                <Tag className="text-secondary h-3 w-3" />
                <span>{language === "en" ? "filter --tag" : "lọc --thẻ"}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className="text-xs"
                  >
                    #{tag}
                    {selectedTag === tag && <X className="ml-1.5 h-3 w-3" />}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Active filters summary */}
          {(searchQuery || selectedTag) && (
            <div className="border-border flex items-center gap-2 border-t pt-2">
              <span className="text-muted-foreground font-mono text-xs">
                <span className="text-secondary">//</span> {filteredPosts.length}{" "}
                {language === "en" ? "results found" : "kết quả"}
              </span>
              {(searchQuery || selectedTag) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedTag(null)
                  }}
                  className="h-6 px-2 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  {language === "en" ? "Clear" : "Xóa"}
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Posts grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-border bg-card/50 border p-12 text-center"
        >
          <Terminal className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground font-mono text-sm">
            <span className="text-primary">$</span> {t("blog.noResults")}
          </p>
          <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
            {language === "en"
              ? "Try adjusting your search or filters"
              : "Thử điều chỉnh tìm kiếm hoặc bộ lọc"}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} language={language} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Results count footer */}
      {filteredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4 text-center"
        >
          <p className="text-muted-foreground font-mono text-xs">
            <span className="text-primary">$</span> echo &quot;
            {language === "en"
              ? `Showing ${filteredPosts.length} posts`
              : `Hiển thị ${filteredPosts.length} bài viết`}
            &quot;
          </p>
        </motion.div>
      )}
    </div>
  )
}
