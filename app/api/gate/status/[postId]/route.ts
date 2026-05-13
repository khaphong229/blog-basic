import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const COOKIE_NAME = "gate_session"

/**
 * GET /api/gate/status/[postId]
 *
 * Returns the gated download unlock status for a post.
 *
 * Logic:
 * - A resource with zero gate_steps is auto-unlocked.
 * - A resource with gate_steps is unlocked only when ALL steps
 *   have a gate_completions record for the current session_id.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const sessionId = request.cookies.get(COOKIE_NAME)?.value

    // No session → nothing is unlocked
    if (!sessionId) {
      return NextResponse.json({
        status: { unlockedResourceIds: [], completedStepIds: [] },
      })
    }

    const supabase = await createClient()

    // 1. Fetch all resources for this post
    const { data: resources, error: resError } = await supabase
      .from("post_resources")
      .select("id")
      .eq("post_id", postId)

    if (resError) {
      console.error("[Gate Status] Failed to fetch resources:", resError)
      return NextResponse.json(
        { error: "Failed to fetch resources" },
        { status: 500 }
      )
    }

    if (!resources || resources.length === 0) {
      return NextResponse.json({
        status: { unlockedResourceIds: [], completedStepIds: [] },
      })
    }

    const resourceIds = resources.map((r) => r.id)

    // 2. Fetch all gate_steps for these resources
    const { data: steps, error: stepsError } = await supabase
      .from("gate_steps")
      .select("id, resource_id")
      .in("resource_id", resourceIds)

    if (stepsError) {
      console.error("[Gate Status] Failed to fetch steps:", stepsError)
      return NextResponse.json(
        { error: "Failed to fetch gate steps" },
        { status: 500 }
      )
    }

    // 3. Fetch all completions for this session + these steps
    const stepIds = (steps ?? []).map((s) => s.id)
    let completedStepSet = new Set<string>()

    if (stepIds.length > 0) {
      const { data: completions, error: compError } = await supabase
        .from("gate_completions")
        .select("step_id")
        .eq("session_id", sessionId)
        .in("step_id", stepIds)

      if (!compError && completions) {
        completedStepSet = new Set(completions.map((c) => c.step_id))
      }
    }

    // 4. Calculate unlock status per resource
    const unlockedResourceIds: string[] = []

    for (const resourceId of resourceIds) {
      const resourceSteps = (steps ?? []).filter(
        (s) => s.resource_id === resourceId
      )

      // No steps → auto-unlocked
      // All steps completed → unlocked
      if (
        resourceSteps.length === 0 ||
        resourceSteps.every((s) => completedStepSet.has(s.id))
      ) {
        unlockedResourceIds.push(resourceId)
      }
    }

    return NextResponse.json({
      status: {
        unlockedResourceIds,
        completedStepIds: [...completedStepSet],
      },
    })
  } catch (error) {
    console.error(
      "[Gate Status] Error:",
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
