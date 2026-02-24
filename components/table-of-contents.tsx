"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    /** HTML content to extract headings from */
    content: string
    /** Currently visible section (optional, for active highlighting) */
    className?: string
}

/**
 * Table of Contents sidebar — parses HTML content for h2/h3 headings
 * and renders a sticky navigable list with active section highlighting.
 */
export default function TableOfContents({ content, className }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("")

    /** Parse headings from HTML content */
    const headings = useMemo((): TocItem[] => {
        const parser = typeof window !== "undefined" ? new DOMParser() : null
        if (!parser) return []

        const doc = parser.parseFromString(content, "text/html")
        const elements = doc.querySelectorAll("h2, h3")
        const items: TocItem[] = []

        elements.forEach((el, index) => {
            const id = el.id || `heading-${index}`
            items.push({
                id,
                text: el.textContent?.trim() || "",
                level: parseInt(el.tagName.charAt(1)),
            })
        })

        return items
    }, [content])

    /** Track which heading is currently in view */
    useEffect(() => {
        if (headings.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            {
                rootMargin: "-80px 0px -75% 0px",
                threshold: 0,
            }
        )

        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [headings])

    /** Handle heading click with smooth scroll */
    const scrollToHeading = useCallback((id: string) => {
        const el = document.getElementById(id)
        if (el) {
            const offset = 100 // account for sticky header
            const top = el.getBoundingClientRect().top + window.scrollY - offset
            window.scrollTo({ top, behavior: "smooth" })
            setActiveId(id)
        }
    }, [])

    if (headings.length === 0) return null

    return (
        <nav className={cn("space-y-1", className)} aria-label="Table of contents">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Contents
            </h4>
            <ul className="space-y-0.5">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                                "block text-left w-full text-sm py-1.5 transition-colors duration-200 border-l-2",
                                heading.level === 2 ? "pl-3" : "pl-6",
                                activeId === heading.id
                                    ? "border-primary text-primary font-medium"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
