"use client"

import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BlogListingProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function BlogListing({ searchQuery, setSearchQuery }: BlogListingProps) {
  const { language, t } = useLanguage()
  const { searchPosts, getAllTags, getPostsByTag } = useBlog()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    return getAllTags(language)
  }, [language, getAllTags])

  const filteredPosts = useMemo(() => {
    let results = selectedTag ? getPostsByTag(selectedTag, language) : searchPosts(searchQuery, language)

    if (selectedTag && searchQuery) {
      const searchResults = new Set(searchPosts(searchQuery, language).map((p) => p.id))
      results = results.filter((p) => searchResults.has(p.id))
    }

    return results
  }, [searchQuery, language, searchPosts, selectedTag, getPostsByTag])

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
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
            <p className="text-sm font-semibold text-muted-foreground">
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
                  {selectedTag === tag && <X className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("blog.noResults")}</p>
        </div>
      ) : (
        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full bg-white group">
                    <CardHeader>
                      <CardTitle className="text-3xl text-pretty group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <span className="font-medium text-foreground">{post.author}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{post.createdAt.toLocaleDateString(language === "en" ? "en-US" : "vi-VN")}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70 mb-6 text-lg line-clamp-3 leading-relaxed">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t pt-4 border-border/50">
                        <span className="text-sm font-medium text-muted-foreground">
                          {post.comments.length} {t("blog.comments")}
                        </span>
                        <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t("blog.readMore")} <span>→</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
