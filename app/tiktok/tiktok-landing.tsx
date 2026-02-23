"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { useBlog } from "@/context/blog-context"
import { Search, Hash, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/** Number of recent posts to show in the grid */
const GRID_POST_LIMIT = 12

/**
 * TikTok Landing Page — interactive client component.
 * Hero section with big code input + recent posts grid.
 */
export default function TikTokLanding() {
    const { language, t } = useLanguage()
    const { posts } = useBlog()
    const router = useRouter()

    const [code, setCode] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Get published posts for the current language, sorted by recent
    const recentPosts = posts
        .filter((p) => p.language === language && p.status === "published")
        .slice(0, GRID_POST_LIMIT)

    /**
     * Handle code search — find post by tiktok_code and redirect.
     */
    const handleSearch = async () => {
        const numCode = parseInt(code.trim(), 10)
        if (isNaN(numCode) || numCode <= 0) {
            setError(t("tiktok.notFound"))
            return
        }

        setIsSearching(true)
        setError(null)

        // Search in local posts first (fast)
        const found = posts.find(
            (p) =>
                p.tiktokCode === numCode &&
                p.language === language &&
                p.status === "published"
        )

        if (found) {
            router.push(`/blog/${found.slug}`)
            return
        }

        // Fallback: try the other language
        const fallback = posts.find(
            (p) => p.tiktokCode === numCode && p.status === "published"
        )

        if (fallback) {
            router.push(`/blog/${fallback.slug}`)
            return
        }

        setIsSearching(false)
        setError(t("tiktok.notFound"))
    }

    /**
     * Handle input change — only allow digits, auto-search on 3+ digits.
     */
    const handleInputChange = (value: string) => {
        // Only allow digits
        const digits = value.replace(/\D/g, "")
        setCode(digits)
        setError(null)
    }

    /**
     * Handle keypress — Enter triggers search.
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && code.trim()) {
            e.preventDefault()
            handleSearch()
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
                {/* Background decoration */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="from-primary/5 via-primary/3 absolute inset-0 bg-linear-to-br to-transparent" />
                    <div className="bg-dot-pattern absolute inset-0 opacity-40" />
                </div>

                <div className="mx-auto max-w-xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        TikTok → Blog
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                        {t("tiktok.title")}
                    </h1>
                    <p className="mb-8 text-muted-foreground text-base sm:text-lg">
                        {t("tiktok.subtitle")}
                    </p>

                    {/* Search Input — Big, prominent, numeric */}
                    <div className="mx-auto max-w-sm">
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder={t("tiktok.placeholder")}
                                value={code}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isSearching}
                                className="h-16 rounded-2xl border-2 border-border/70 pl-14 pr-28 text-center text-3xl font-bold tracking-widest shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                aria-label={t("tiktok.enterCode")}
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={!code.trim() || isSearching}
                                className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-xl px-5 text-base font-semibold shadow-sm cursor-pointer"
                            >
                                {isSearching ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Search className="mr-2 h-5 w-5" />
                                )}
                                {isSearching ? t("tiktok.searching") : t("tiktok.readPost")}
                            </Button>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== RECENT POSTS GRID ===== */}
            {recentPosts.length > 0 && (
                <section className="border-t border-border/50 px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-8 text-center text-xl font-bold sm:text-2xl">
                            {t("tiktok.recentPosts")}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        {post.featuredImage ? (
                                            <Image
                                                src={post.featuredImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
                                                <Hash className="h-10 w-10 text-primary/30" />
                                            </div>
                                        )}

                                        {/* TikTok Code Badge */}
                                        {post.tiktokCode && (
                                            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                                <Hash className="h-3 w-3" />
                                                {post.tiktokCode}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 sm:p-4">
                                        <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2 sm:text-base group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {post.createdAt
                                                    ? new Date(post.createdAt).toLocaleDateString(
                                                        language === "vi" ? "vi-VN" : "en-US",
                                                        { day: "2-digit", month: "short" }
                                                    )
                                                    : ""}
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
