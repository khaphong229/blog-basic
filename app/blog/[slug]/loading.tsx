import { Loader2 } from "lucide-react"

/**
 * Loading skeleton for blog detail page
 * Shown while server data is being fetched
 */
export default function BlogDetailLoading() {
    return (
        <div className="bg-background text-foreground relative min-h-screen">
            <div className="container mx-auto px-4 pt-24 pb-16">
                <div className="mx-auto max-w-3xl animate-pulse space-y-8">
                    {/* Back button skeleton */}
                    <div className="h-4 w-32 rounded bg-muted" />

                    {/* Tags skeleton */}
                    <div className="flex justify-center gap-2">
                        <div className="h-6 w-16 rounded-full bg-muted" />
                        <div className="h-6 w-20 rounded-full bg-muted" />
                    </div>

                    {/* Title skeleton */}
                    <div className="space-y-3 text-center">
                        <div className="mx-auto h-10 w-3/4 rounded bg-muted" />
                        <div className="mx-auto h-10 w-1/2 rounded bg-muted" />
                    </div>

                    {/* Meta info skeleton */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-4 w-24 rounded bg-muted" />
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-4 pt-8">
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-5/6 rounded bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-32 w-full rounded-xl bg-muted" />
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                </div>
            </div>

            {/* Centered loading indicator */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-lg">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading article...</span>
            </div>
        </div>
    )
}
