"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Plus, X, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AuthorSelectProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    /** Placeholder text when no author is selected */
    placeholder?: string
}

/** Storage key for locally-saved custom authors */
const LOCAL_AUTHORS_KEY = "apkute_custom_authors"
/** Storage key for the default author */
const DEFAULT_AUTHOR_KEY = "apkute_default_author"

/**
 * AuthorSelect — Combo select + create-new for author field.
 * Fetches existing authors from DB, merges with localStorage custom authors,
 * and allows creating new options on the fly.
 */
export default function AuthorSelect({ value, onChange, disabled, placeholder }: AuthorSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [authors, setAuthors] = useState<string[]>([])
    const [newAuthor, setNewAuthor] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    /** Load authors from DB + localStorage on mount */
    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from("posts")
                    .select("author")

                // Deduplicate authors from DB
                const dbAuthors = Array.from(
                    new Set((data as { author: string }[] | null)?.map((p) => p.author) || [])
                )

                // Merge with locally saved custom authors
                const localRaw = localStorage.getItem(LOCAL_AUTHORS_KEY)
                const localAuthors: string[] = localRaw ? JSON.parse(localRaw) : []
                const merged = Array.from(new Set([...dbAuthors, ...localAuthors])).sort()

                setAuthors(merged)

                // Auto-set default author if value is empty
                if (!value) {
                    const defaultAuthor = localStorage.getItem(DEFAULT_AUTHOR_KEY)
                    if (defaultAuthor && merged.includes(defaultAuthor)) {
                        onChange(defaultAuthor)
                    }
                }
            } catch (err) {
                console.error("Failed to load authors:", err)
            }
        }
        loadAuthors()
    }, [value, onChange])

    /** Close dropdown when clicking outside */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setIsCreating(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    /** Select an existing author */
    const handleSelect = (author: string) => {
        onChange(author)
        localStorage.setItem(DEFAULT_AUTHOR_KEY, author)
        setIsOpen(false)
    }

    /** Create a new author option */
    const handleCreate = () => {
        const trimmed = newAuthor.trim()
        if (!trimmed || authors.includes(trimmed)) return

        const updated = [...authors, trimmed].sort()
        setAuthors(updated)

        // Save to localStorage
        const localRaw = localStorage.getItem(LOCAL_AUTHORS_KEY)
        const localAuthors: string[] = localRaw ? JSON.parse(localRaw) : []
        localStorage.setItem(LOCAL_AUTHORS_KEY, JSON.stringify([...localAuthors, trimmed]))

        handleSelect(trimmed)
        setNewAuthor("")
        setIsCreating(false)
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="border-border/70 focus:border-primary bg-background flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
            >
                <span className={value ? "text-foreground" : "text-muted-foreground"}>
                    {value || placeholder || "Chọn tác giả..."}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="bg-popover border-border absolute z-50 mt-1 w-full rounded-lg border shadow-lg">
                    {/* Existing options */}
                    <div className="max-h-48 overflow-y-auto p-1">
                        {authors.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Chưa có tác giả nào
                            </div>
                        ) : (
                            authors.map((author) => (
                                <button
                                    key={author}
                                    type="button"
                                    onClick={() => handleSelect(author)}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors text-left"
                                >
                                    {value === author && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                                    <span className={value === author ? "font-medium text-primary" : ""}>{author}</span>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-border" />

                    {/* Create new */}
                    {isCreating ? (
                        <div className="flex items-center gap-2 p-2">
                            <input
                                type="text"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); handleCreate() }
                                    if (e.key === "Escape") { setIsCreating(false); setNewAuthor("") }
                                }}
                                placeholder="Nhập tên tác giả..."
                                className="bg-background border-border h-8 flex-1 rounded-md border px-2 text-sm focus:outline-none focus:border-primary"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={!newAuthor.trim()}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsCreating(false); setNewAuthor("") }}
                                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo tác giả mới
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
