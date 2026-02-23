import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/** Max file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024

/** Allowed image MIME types */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

/**
 * POST /api/upload — Upload image to Supabase Storage
 *
 * Accepts multipart/form-data with a single "file" field.
 * Returns the public URL of the uploaded image.
 *
 * Requires authentication (admin only).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}-${randomId}.${ext}`
    const filePath = `blog-images/${fileName}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrl,
      fileName,
      filePath,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload handler error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
