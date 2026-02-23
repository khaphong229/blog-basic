"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Loader2, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    /** Current image URL */
    value?: string | null
    /** Callback when image changes */
    onChange: (url: string | null) => void
    /** Whether the upload is disabled */
    disabled?: boolean
    /** Custom class name */
    className?: string
}

/** Max file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

/**
 * Image upload component with drag & drop, preview, and validation
 * Uploads to /api/upload → Supabase Storage
 */
export default function ImageUpload({
    value,
    onChange,
    disabled = false,
    className,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(value || null)
    const inputRef = useRef<HTMLInputElement>(null)

    /** Validate and upload a file */
    const uploadFile = useCallback(
        async (file: File) => {
            setError(null)

            // Client-side validation
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError("Only JPEG, PNG, and WebP images are allowed")
                return
            }
            if (file.size > MAX_FILE_SIZE) {
                setError("Image must be smaller than 5MB")
                return
            }

            // Show preview immediately
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            setIsUploading(true)

            try {
                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || "Upload failed")
                }

                const { url } = await response.json()
                setPreview(url)
                onChange(url)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed")
                setPreview(null)
                onChange(null)
            } finally {
                setIsUploading(false)
                URL.revokeObjectURL(objectUrl)
            }
        },
        [onChange]
    )

    /** Handle file input change */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadFile(file)
    }

    /** Handle drag events */
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e: React.DragEvent) => {
        handleDrag(e)
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        handleDrag(e)
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        handleDrag(e)
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) uploadFile(file)
    }

    /** Remove current image */
    const handleRemove = () => {
        setPreview(null)
        setError(null)
        onChange(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className={cn("space-y-2", className)}>
            {/* Preview / Drop Zone */}
            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                    <img
                        src={preview}
                        alt="Featured image preview"
                        className="w-full aspect-video object-cover"
                    />

                    {/* Overlay actions */}
                    {!disabled && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => inputRef.current?.click()}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Replace
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                    )}

                    {/* Upload spinner */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={() => !disabled && inputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDrag}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
                        isDragging
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/30",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="mb-3 p-3 rounded-xl bg-muted">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">
                                {isDragging ? "Drop image here" : "Click or drag to upload"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                JPEG, PNG, or WebP • Max 5MB
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={disabled}
                className="hidden"
            />
        </div>
    )
}
