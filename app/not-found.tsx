import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Global 404 page
 * Server Component — renders without JavaScript
 */
export default function NotFound() {
    return (
        <div className="bg-background text-foreground min-h-screen flex items-center justify-center p-4">
            <div className="mx-auto max-w-md text-center">
                <div className="mb-6">
                    <span className="text-8xl font-black text-muted-foreground/20">404</span>
                </div>

                <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <Link href="/">
                    <Button size="lg" className="gap-2 rounded-full px-8">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
