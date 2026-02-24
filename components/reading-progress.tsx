"use client"

import { useState, useEffect } from "react"

/**
 * Reading progress bar — fixed at the top of the page.
 * Shows a green progress bar indicating how far the user has scrolled.
 */
export default function ReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        /** Calculate scroll progress as a percentage */
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setProgress(Math.min(100, scrollPercent))
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-60 h-[3px] bg-transparent">
            <div
                className="h-full bg-primary transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Reading progress"
            />
        </div>
    )
}
