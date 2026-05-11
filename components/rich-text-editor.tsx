"use client"

import React from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Quote,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Code,
  Minus,
  Eye,
  Pencil,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

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

  const focusTextarea = (pos: number) => {
    const textarea = textareaRef.current
    if (!textarea) return
    setTimeout(() => {
      textarea.selectionStart = pos
      textarea.selectionEnd = pos
      textarea.focus()
    }, 0)
  }

  /** Wrap selected text with prefix/suffix (bold, italic, strikethrough, code, link, image) */
  const insertWrap = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || "text"
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)
    focusTextarea(start + before.length + selectedText.length + after.length)
  }

  /** Insert a prefix at the beginning of the current line (heading, blockquote, list) */
  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeCursor = value.substring(0, start)
    const lineStart = beforeCursor.lastIndexOf("\n") + 1

    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart)
    onChange(newValue)
    focusTextarea(lineStart + prefix.length)
  }

  /** Insert a block element on its own line (horizontal rule) */
  const insertBlock = (text: string) => {
    const start = textareaRef.current?.selectionStart ?? value.length
    const beforeCursor = value.substring(0, start)
    const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith("\n\n")

    const prefix = needsNewline ? "\n\n" : ""
    const suffix = beforeCursor.length === 0 ? "\n" : "\n\n"
    const insertion = prefix + text + suffix

    const newValue = value.substring(0, start) + insertion + value.substring(start)
    onChange(newValue)
    focusTextarea(start + insertion.length)
  }

  /** Toolbar button shared style */
  const btnClass =
    "h-8 w-8 p-0 cursor-pointer"

  /** Toolbar groups */
  const toolbarGroups = [
    {
      buttons: [
        { icon: Bold, label: "Bold", action: () => insertWrap("**", "**"), title: "Bold (Ctrl+B)" },
        { icon: Italic, label: "Italic", action: () => insertWrap("_", "_"), title: "Italic (Ctrl+I)" },
        { icon: Strikethrough, label: "Strikethrough", action: () => insertWrap("~~", "~~"), title: "Strikethrough" },
      ],
    },
    {
      buttons: [
        { icon: Heading2, label: "Heading", action: () => insertLinePrefix("## "), title: "Heading 2" },
        { icon: Quote, label: "Blockquote", action: () => insertLinePrefix("> "), title: "Blockquote" },
      ],
    },
    {
      buttons: [
        { icon: List, label: "Unordered List", action: () => insertLinePrefix("- "), title: "Bullet List" },
        { icon: ListOrdered, label: "Ordered List", action: () => insertLinePrefix("1. "), title: "Numbered List" },
      ],
    },
    {
      buttons: [
        { icon: LinkIcon, label: "Link", action: () => insertWrap("[", "](url)"), title: "Insert Link" },
        { icon: ImageIcon, label: "Image", action: () => insertWrap("![", "](url)"), title: "Insert Image" },
        { icon: Code, label: "Code", action: () => insertWrap("`", "`"), title: "Inline Code" },
      ],
    },
    {
      buttons: [
        { icon: Minus, label: "Horizontal Rule", action: () => insertBlock("---"), title: "Horizontal Rule" },
      ],
    },
  ]

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap bg-card/50 p-1.5 rounded-lg border border-border">
        {toolbarGroups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <div className="mx-1 h-5 w-px bg-border" />}
            {group.buttons.map((btn) => (
              <Button
                key={btn.label}
                type="button"
                variant="ghost"
                size="icon"
                className={btnClass}
                onClick={btn.action}
                title={btn.title}
              >
                <btn.icon className="w-4 h-4" />
              </Button>
            ))}
          </React.Fragment>
        ))}

        {/* Preview/Edit Toggle — pushed to the right */}
        <div className="ml-auto pl-2">
          <Button
            type="button"
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1.5 h-8 cursor-pointer"
          >
            {showPreview ? (
              <>
                <Pencil className="w-3.5 h-3.5" />
                {language === "en" ? "Edit" : "Chỉnh sửa"}
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                {language === "en" ? "Preview" : "Xem trước"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview / Editor */}
      {showPreview ? (
        <div className="border border-border rounded-lg p-6 bg-card min-h-[200px] max-h-[600px] overflow-y-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl max-w-none">
          {value.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  return <h1 id={id}>{children}</h1>
                },
                h2: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  return <h2 id={id}>{children}</h2>
                },
                h3: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  return <h3 id={id}>{children}</h3>
                },
                a: ({ href, children, ...props }) => {
                  const isExternal = href?.startsWith("http")
                  return (
                    <a
                      href={href}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">
              {language === "en" ? "Nothing to preview" : "Không có gì để xem trước"}
            </p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm"
        />
      )}
    </div>
  )
}
