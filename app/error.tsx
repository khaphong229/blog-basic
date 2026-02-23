"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Root error boundary — catches unhandled errors across the app
 */
export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="bg-background text-foreground min-h-screen flex items-center justify-center p-4">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
                <p className="text-muted-foreground mb-8">
                    An unexpected error occurred. Please try refreshing the page.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={reset} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
