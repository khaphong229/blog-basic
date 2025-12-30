"use client"

import type { BlogPost } from "@/context/blog-context"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface UrlShortenerProps {
  post: BlogPost
}

export default function UrlShortener({ post }: UrlShortenerProps) {
  const { language, t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(post.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{language === "en" ? "Share Short URL" : "Chia sẻ URL ngắn"}</label>
      <div className="flex gap-2">
        <Input value={post.shortUrl} readOnly className="font-mono text-sm" />
        <Button type="button" size="sm" variant="outline" onClick={handleCopy} className="shrink-0 bg-transparent">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {language === "en"
          ? "Share this link to easily reference your post"
          : "Chia sẻ liên kết này để dễ dàng tham chiếu bài viết của bạn"}
      </p>
    </div>
  )
}
