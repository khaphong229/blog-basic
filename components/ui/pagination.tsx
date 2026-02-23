"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
    /** Current page (1-indexed) */
    currentPage: number
    /** Total number of pages */
    totalPages: number
    /** Called when page changes */
    onPageChange: (page: number) => void
    /** Custom class name */
    className?: string
}

/**
 * Reusable pagination component
 * Shows page numbers with ellipsis for large page counts
 */
export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null

    /** Generate page numbers to show (with ellipsis) */
    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            // Always show first page
            pages.push(1)

            if (currentPage > 3) pages.push("ellipsis")

            // Show pages around current
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push("ellipsis")

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        onPageChange(page)

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <nav
            className={cn("flex items-center justify-center gap-1", className)}
            aria-label="Pagination"
        >
            {/* Previous */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {getPageNumbers().map((page, i) =>
                page === "ellipsis" ? (
                    <div
                        key={`ellipsis-${i}`}
                        className="flex h-9 w-9 items-center justify-center"
                    >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                ) : (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        className={cn(
                            "h-9 w-9 rounded-lg text-sm font-medium",
                            page === currentPage && "pointer-events-none"
                        )}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </Button>
                )
            )}

            {/* Next */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    )
}
