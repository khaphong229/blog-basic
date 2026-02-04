import { supabase } from "@/lib/supabase"
import type {
  UrlShortenerConfig,
  UrlShortenerConfigInsert,
  UrlShortenerConfigUpdate,
  ShortenedUrl,
  ShortenedUrlInsert,
  UrlShortenerLog,
  UrlShortenerLogInsert,
  Language,
} from "@/lib/supabase"

// ===========================================
// URL Shortener Config
// ===========================================

/**
 * Get URL shortener config for a language
 */
export async function getUrlConfig(language: Language): Promise<UrlShortenerConfig | null> {
  const { data, error } = await supabase
    .from("url_shortener_config")
    .select("*")
    .eq("language", language)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as UrlShortenerConfig
}

/**
 * Get all URL shortener configs
 */
export async function getAllUrlConfigs(): Promise<{
  en: UrlShortenerConfig | null
  vi: UrlShortenerConfig | null
}> {
  const { data, error } = await supabase.from("url_shortener_config").select("*")

  if (error) throw error

  const configs = data as UrlShortenerConfig[] | null

  return {
    en: configs?.find((c) => c.language === "en") || null,
    vi: configs?.find((c) => c.language === "vi") || null,
  }
}

/**
 * Create or update URL shortener config
 */
export async function upsertUrlConfig(
  config: UrlShortenerConfigInsert
): Promise<UrlShortenerConfig> {
  const { data, error } = await supabase
    .from("url_shortener_config")
    .upsert(config as never, { onConflict: "language" })
    .select()
    .single()

  if (error) throw error
  return data as UrlShortenerConfig
}

/**
 * Update URL shortener config
 */
export async function updateUrlConfig(
  language: Language,
  updates: UrlShortenerConfigUpdate
): Promise<UrlShortenerConfig> {
  const { data, error } = await supabase
    .from("url_shortener_config")
    .update(updates as never)
    .eq("language", language)
    .select()
    .single()

  if (error) throw error
  return data as UrlShortenerConfig
}

// ===========================================
// Shortened URLs
// ===========================================

/**
 * Get shortened URL by post ID
 */
export async function getShortenedUrlByPost(postId: string): Promise<ShortenedUrl | null> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("post_id", postId)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as ShortenedUrl
}

/**
 * Get shortened URL by short code
 */
export async function getShortenedUrlByCode(shortCode: string): Promise<ShortenedUrl | null> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("short_code", shortCode)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as ShortenedUrl
}

/**
 * Create a shortened URL
 */
export async function createShortenedUrl(url: ShortenedUrlInsert): Promise<ShortenedUrl> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .insert(url as never)
    .select()
    .single()

  if (error) throw error
  return data as ShortenedUrl
}

/**
 * Increment click count for a shortened URL
 */
export async function incrementClickCount(urlId: string): Promise<void> {
  const { data: url, error: fetchError } = await supabase
    .from("shortened_urls")
    .select("clicks")
    .eq("id", urlId)
    .single()

  if (fetchError) throw fetchError

  const currentClicks = (url as { clicks: number })?.clicks || 0

  const { error } = await supabase
    .from("shortened_urls")
    .update({ clicks: currentClicks + 1 } as never)
    .eq("id", urlId)

  if (error) throw error
}

/**
 * Get all shortened URLs
 */
export async function getAllShortenedUrls(): Promise<ShortenedUrl[]> {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as ShortenedUrl[]) || []
}

// ===========================================
// URL Shortener Logs
// ===========================================

/**
 * Add a URL shortener log
 */
export async function addUrlLog(log: UrlShortenerLogInsert): Promise<UrlShortenerLog> {
  const { data, error } = await supabase
    .from("url_shortener_logs")
    .insert(log as never)
    .select()
    .single()

  if (error) throw error
  return data as UrlShortenerLog
}

/**
 * Get recent URL shortener logs
 */
export async function getRecentUrlLogs(
  language?: Language,
  limit: number = 10
): Promise<UrlShortenerLog[]> {
  let query = supabase
    .from("url_shortener_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (language) {
    query = query.eq("language", language)
  }

  const { data, error } = await query

  if (error) throw error
  return (data as UrlShortenerLog[]) || []
}

// ===========================================
// URL Shortening Logic
// ===========================================

/**
 * Shorten a URL using the configured provider
 */
export async function shortenUrl(
  originalUrl: string,
  language: Language,
  postId?: string
): Promise<ShortenedUrl | null> {
  const config = await getUrlConfig(language)

  if (!config || !config.is_active) {
    // No active config, create a local short URL
    const shortCode = generateShortCode()
    return createShortenedUrl({
      original_url: originalUrl,
      short_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/s/${shortCode}`,
      short_code: shortCode,
      language,
      post_id: postId || null,
    })
  }

  try {
    // Call the external API
    const body = config.body_format.replace("{{original_url}}", originalUrl)

    const response = await fetch(config.endpoint, {
      method: config.http_method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api_key}`,
      },
      body: config.http_method !== "GET" ? body : undefined,
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const result = await response.json()
    const shortUrl = result.shortUrl || result.short_url || result.link || result.url

    if (!shortUrl) {
      throw new Error("Could not extract short URL from response")
    }

    // Log success
    await addUrlLog({
      language,
      test_url: originalUrl,
      short_url: shortUrl,
      status: "success",
      error_message: null,
    })

    // Save to database
    return createShortenedUrl({
      original_url: originalUrl,
      short_url: shortUrl,
      short_code: extractShortCode(shortUrl),
      language,
      post_id: postId || null,
    })
  } catch (error) {
    // Log error
    await addUrlLog({
      language,
      test_url: originalUrl,
      short_url: null,
      status: "error",
      error_message: error instanceof Error ? error.message : "Unknown error",
    })

    return null
  }
}

/**
 * Generate a random short code
 */
function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Extract short code from a URL
 */
function extractShortCode(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    return path.split("/").pop() || null
  } catch {
    return null
  }
}
