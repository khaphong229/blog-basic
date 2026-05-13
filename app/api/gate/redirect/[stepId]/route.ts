import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const COOKIE_NAME = "gate_session"
const COOKIE_MAX_AGE = 86400 // 24 hours

/**
 * GET /api/gate/redirect/[stepId]
 *
 * Gate step redirect handler.
 * 1. Lookup the gate_step record
 * 2. Get or create an anonymous session_id via cookie
 * 3. Log the completion in gate_completions
 * 4. 302 redirect to the step's target URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const { stepId } = await params

    const supabase = await createClient()

    // 1. Find the gate step (joined with resource to validate step exists)
    const { data: step, error: stepError } = await supabase
      .from("gate_steps")
      .select("id, url")
      .eq("id", stepId)
      .single()

    if (stepError || !step) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 })
    }

    // Validate step URL
    if (!step.url || (!step.url.startsWith("http://") && !step.url.startsWith("https://"))) {
      return NextResponse.json({ error: "Invalid step URL" }, { status: 400 })
    }

    // 2. Get or create session_id from cookie
    const existingSession = request.cookies.get(COOKIE_NAME)
    const sessionId = existingSession?.value ?? crypto.randomUUID()

    // 3. Log completion (fire-and-forget — don't block redirect on insert failure)
    const { error: insertError } = await supabase.from("gate_completions").insert({
      step_id: stepId,
      session_id: sessionId,
    })

    if (insertError) {
      console.error(
        `[Gate Redirect] Failed to log completion: stepId=${stepId} sessionId=${sessionId}`,
        insertError
      )
    }

    // 4. Build redirect response
    const response = NextResponse.redirect(step.url)

    // Set cookie if this is a new session
    if (!existingSession) {
      response.cookies.set(COOKIE_NAME, sessionId, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: "lax",
      })
    }

    return response
  } catch (error) {
    console.error(
      "[Gate Redirect] Error:",
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
