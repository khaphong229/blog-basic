"use client"

import React from "react"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Bold, Italic, Heading2, List, LinkIcon, Code } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function RichTextEditor({ value, onChange, placeholder, rows = 8 }: RichTextEditorProps) {
  const { language } = useLanguage()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || "text"
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
      textarea.focus()
    }, 0)
  }

  const renderPreview = () => {
    return value.split("\n").map((line, i) => {
      if (line.startsWith("# "))
        return (
          <h1 key={i} className="text-2xl font-bold mt-4">
            {line.slice(2)}
          </h1>
        )
      if (line.startsWith("## "))
        return (
          <h2 key={i} className="text-xl font-bold mt-3">
            {line.slice(3)}
          </h2>
        )
      if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>
      if (line.startsWith("**") && line.endsWith("**")) return <strong key={i}>{line.slice(2, -2)}</strong>
      if (line.startsWith("_") && line.endsWith("_")) return <em key={i}>{line.slice(1, -1)}</em>
      if (line.trim())
        return (
          <p key={i} className="my-2">
            {line}
          </p>
        )
      return null
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap bg-card/50 p-2 rounded border border-border">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")} title="Bold">
          <Bold className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("_", "_")} title="Italic">
          <Italic className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("## ", "")} title="Heading">
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("- ", "")} title="List">
          <List className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("[", "](url)")} title="Link">
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`")} title="Code">
          <Code className="w-4 h-4" />
        </Button>
        <div className="ml-auto">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? (language === "en" ? "Edit" : "Chỉnh sửa") : language === "en" ? "Preview" : "Xem trước"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="border border-border rounded p-4 bg-card/50 min-h-[200px] max-h-[400px] overflow-y-auto prose prose-invert max-w-none">
          {renderPreview()}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </div>
  )
}
