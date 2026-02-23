import Link from "next/link"
import { ArrowLeft, FileX } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedGradientBackdrop from "@/components/animated-gradient-backdrop"
import Navigation from "@/components/navigation"

/**
 * 404 page for blog posts that don't exist
 * Server Component — renders without JavaScript
 */
export default function BlogNotFound() {
    return (
        <div className="bg-background text-foreground relative min-h-screen overflow-hidden">
            <AnimatedGradientBackdrop />
            <Navigation />

            <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
                <div className="mx-auto max-w-md text-center py-20">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                        <FileX className="h-10 w-10 text-muted-foreground" />
                    </div>

                    <h1 className="text-3xl font-bold mb-3">Article Not Found</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        The article you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>

                    <Link href="/">
                        <Button size="lg" className="gap-2 rounded-full px-8">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
