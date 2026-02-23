import { Loader2 } from "lucide-react"

/**
 * Root loading state — shown during route transitions
 */
export default function RootLoading() {
    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
    )
}
