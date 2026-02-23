"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"
import {
    getAllUrlConfigs,
    upsertUrlConfig,
    getRecentUrlLogs,
    addUrlLog as apiAddUrlLog,
} from "@/lib/api/url-shortener"
import type { URLShortenerConfig, URLLog } from "@/types/blog"

// ===========================================
// Context Type
// ===========================================

interface UrlShortenerContextType {
    urlConfigs: { en: URLShortenerConfig | null; vi: URLShortenerConfig | null }
    updateUrlConfig: (language: "en" | "vi", config: URLShortenerConfig) => void
    urlLogs: URLLog[]
    addUrlLog: (log: Omit<URLLog, "id" | "timestamp">) => void
}

const UrlShortenerContext = createContext<UrlShortenerContextType | undefined>(undefined)

// ===========================================
// Provider (only wrap in admin settings)
// ===========================================

export function UrlShortenerProvider({ children }: { children: ReactNode }) {
    const [urlConfigs, setUrlConfigs] = useState<{
        en: URLShortenerConfig | null
        vi: URLShortenerConfig | null
    }>({ en: null, vi: null })
    const [urlLogs, setUrlLogs] = useState<URLLog[]>([])

    const fetchUrlConfigs = useCallback(async () => {
        try {
            const configs = await getAllUrlConfigs()
            setUrlConfigs({
                en: configs.en
                    ? {
                        provider: configs.en.provider, endpoint: configs.en.endpoint,
                        apiKey: configs.en.api_key, httpMethod: configs.en.http_method,
                        bodyFormat: configs.en.body_format, active: configs.en.is_active,
                    }
                    : null,
                vi: configs.vi
                    ? {
                        provider: configs.vi.provider, endpoint: configs.vi.endpoint,
                        apiKey: configs.vi.api_key, httpMethod: configs.vi.http_method,
                        bodyFormat: configs.vi.body_format, active: configs.vi.is_active,
                    }
                    : null,
            })
        } catch (err) {
            console.error("Error fetching URL configs:", err)
        }
    }, [])

    const fetchUrlLogs = useCallback(async () => {
        try {
            const logs = await getRecentUrlLogs(undefined, 50)
            setUrlLogs(
                logs.map((log) => ({
                    id: log.id,
                    timestamp: new Date(log.created_at),
                    originalUrl: log.test_url,
                    shortenedUrl: log.short_url || "",
                    language: log.language as "en" | "vi",
                    status: log.status === "success" ? "success" as const : "failed" as const,
                    message: log.error_message || undefined,
                }))
            )
        } catch (err) {
            console.error("Error fetching URL logs:", err)
        }
    }, [])

    useEffect(() => {
        fetchUrlConfigs()
        fetchUrlLogs()
    }, [fetchUrlConfigs, fetchUrlLogs])

    const updateUrlConfig = async (language: "en" | "vi", config: URLShortenerConfig) => {
        try {
            await upsertUrlConfig({
                language, provider: config.provider, endpoint: config.endpoint,
                api_key: config.apiKey, http_method: config.httpMethod,
                body_format: config.bodyFormat, is_active: config.active,
            })
            setUrlConfigs((prev) => ({ ...prev, [language]: config }))
            await fetchUrlConfigs()
        } catch (err) {
            console.error("Error updating URL config:", err)
            throw err
        }
    }

    const addUrlLog = async (log: Omit<URLLog, "id" | "timestamp">) => {
        try {
            await apiAddUrlLog({
                language: log.language, test_url: log.originalUrl,
                short_url: log.shortenedUrl || null,
                status: log.status === "success" ? "success" : "error",
                error_message: log.message || null,
            })
            await fetchUrlLogs()
        } catch (err) {
            console.error("Error adding URL log:", err)
            throw err
        }
    }

    return (
        <UrlShortenerContext.Provider value={{ urlConfigs, updateUrlConfig, urlLogs, addUrlLog }}>
            {children}
        </UrlShortenerContext.Provider>
    )
}

/** Hook for accessing URL shortener context */
export function useUrlShortener() {
    const context = useContext(UrlShortenerContext)
    if (!context) throw new Error("useUrlShortener must be used within UrlShortenerProvider")
    return context
}
