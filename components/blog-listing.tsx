"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Loader2, Search, Filter } from "lucide-react"
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
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 border-border/50 flex flex-col justify-between gap-8 rounded-3xl border p-6 backdrop-blur-sm md:flex-row md:items-start"
      >
        <div className="relative w-full md:max-w-md">
          <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder={t("blog.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary h-11 rounded-xl pl-9 transition-all"
          />
        </div>

        {allTags.length > 0 && (
          <div className="w-full space-y-3 md:w-auto">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              <span>{language === "en" ? "Filter by topics:" : "Lọc theo chủ đề:"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`h-8 rounded-full px-4 text-xs transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 shadow-md"
                      : "bg-background/50 hover:bg-background hover:text-foreground border-border/50 hover:border-primary/30"
                  }`}
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
        <div className="bg-muted/10 border-border/50 rounded-3xl border border-dashed py-20 text-center">
          <p className="text-muted-foreground text-lg">{t("blog.noResults")}</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedTag(null)
            }}
            className="text-primary mt-2"
          >
            {language === "en" ? "Clear filters" : "Xóa bộ lọc"}
          </Button>
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
