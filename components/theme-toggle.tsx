"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Theme toggle button — cycles through light → dark → system
 * Shows current theme icon with smooth transition
 */
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" disabled>
                <Sun className="h-4 w-4" />
            </Button>
        )
    }

    /** Cycle: light → dark → system */
    const cycleTheme = () => {
        if (theme === "light") setTheme("dark")
        else if (theme === "dark") setTheme("system")
        else setTheme("light")
    }

    const icon =
        theme === "dark" ? <Moon className="h-4 w-4" /> :
            theme === "light" ? <Sun className="h-4 w-4" /> :
                <Monitor className="h-4 w-4" />

    const label =
        theme === "dark" ? "Dark mode" :
            theme === "light" ? "Light mode" :
                "System theme"

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg cursor-pointer"
            onClick={cycleTheme}
            aria-label={label}
            title={label}
        >
            {icon}
        </Button>
    )
}
