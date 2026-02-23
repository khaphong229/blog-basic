"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

/**
 * Theme provider wrapper — provides dark/light mode support
 * Uses next-themes with system preference detection + manual toggle
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    )
}
