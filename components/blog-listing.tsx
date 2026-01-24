"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
        <Loader2 className="text-primary mb-4 h-10 w-10 animate-spin" />
        <p className="text-muted-foreground">
          {language === "en" ? "Loading posts..." : "Đang tải bài viết..."}
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-2 text-lg">
          {language === "en" ? "Failed to load posts" : "Không thể tải bài viết"}
        </p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div>
          <Input
            placeholder={t("blog.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-white shadow-sm"
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-semibold">
              {language === "en" ? "Filter by tag:" : "Lọc theo thẻ:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                  {selectedTag === tag && <X className="ml-1 h-3 w-3" />}
                </Button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">{t("blog.noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="h-full"
              >
                <BlogCard post={post} language={language} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
