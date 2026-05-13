import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const COOKIE_NAME = "gate_session"

/**
 * GET /api/gate/download/[resourceId]
 *
 * Download / redirect handler for gated resources.
 *
 * Flow:
 * 1. Validate session cookie exists
 * 2. Fetch the resource
 * 3. Check all gate_steps are completed for this session
 * 4. Atomic increment of download_count via RPC
 * 5. Redirect or serve the resource
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const sessionId = request.cookies.get(COOKIE_NAME)?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found. Please complete the required steps first." },
        { status: 403 }
      )
    }

    const supabase = await createClient()

    // 1. Fetch the resource
    const { data: resource, error: resError } = await supabase
      .from("post_resources")
      .select("*")
      .eq("id", resourceId)
      .single()

    if (resError || !resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // 2. Fetch all gate_steps for this resource
    const { data: steps } = await supabase
      .from("gate_steps")
      .select("id")
      .eq("resource_id", resourceId)

    // 3. Check unlock status
    if (steps && steps.length > 0) {
      const { data: completions } = await supabase
        .from("gate_completions")
        .select("step_id")
        .eq("session_id", sessionId)
        .in("step_id", steps.map((s) => s.id))

      const completedStepIds = new Set(
        completions?.map((c) => c.step_id) ?? []
      )
      const allCompleted = steps.every((s) => completedStepIds.has(s.id))

      if (!allCompleted) {
        return NextResponse.json(
          { error: "Not all steps completed. Please unlock this resource first." },
          { status: 403 }
        )
      }
    }

    // 4. Atomic increment download count
    const { error: rpcError } = await supabase.rpc(
      "increment_resource_download_count",
      { res_id: resourceId }
    )

    if (rpcError) {
      console.error(
        `[Gate Download] Failed to increment download count: resourceId=${resourceId}`,
        rpcError
      )
    }

    // 5. Handle by resource type
    if (resource.type === "external") {
      if (!resource.external_url) {
        return NextResponse.json(
          { error: "Resource has no external URL configured" },
          { status: 400 }
        )
      }
      return NextResponse.redirect(resource.external_url)
    }

    // type === 'upload' — not implemented yet
    return NextResponse.json(
      { error: "File download not yet implemented" },
      { status: 501 }
    )
  } catch (error) {
    console.error(
      "[Gate Download] Error:",
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
