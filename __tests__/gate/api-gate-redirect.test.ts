/**
 * Integration tests for GET /api/gate/redirect/[stepId]
 *
 * Mocks @/lib/supabase/server to avoid real DB connection.
 * Tests Next.js route handler directly.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Mock the supabase server client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  insert: vi.fn().mockReturnThis(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => mockSupabase),
}))

// Dynamic import so mocks are set up first
const { GET } = await import("@/app/api/gate/redirect/[stepId]/route")

function createMockRequest(cookieValue?: string): NextRequest {
  const url = "http://localhost:3000/api/gate/redirect/step-1"
  const headers = new Headers()
  if (cookieValue) {
    headers.set("cookie", `gate_session=${cookieValue}`)
  }
  return new NextRequest(url, { headers })
}

describe("GET /api/gate/redirect/[stepId]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 404 when step is not found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    })

    const req = createMockRequest()
    const params = Promise.resolve({ stepId: "non-existent" })
    const response = await GET(req, { params })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe("Step not found")
  })

  it("returns 400 when step URL is invalid", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { id: "step-1", url: "invalid-url" },
      error: null,
    })

    const req = createMockRequest()
    const params = Promise.resolve({ stepId: "step-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe("Invalid step URL")
  })

  it("returns 302 redirect and sets cookie for new session", async () => {
    const stepUrl = "https://youtube.com/watch?v=123"
    mockSupabase.single.mockResolvedValue({
      data: { id: "step-1", url: stepUrl },
      error: null,
    })
    mockSupabase.insert.mockResolvedValue({ error: null })

    const req = createMockRequest()
    const params = Promise.resolve({ stepId: "step-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(stepUrl)

    // Should set gate_session cookie
    const setCookie = response.headers.get("set-cookie")
    expect(setCookie).toContain("gate_session=")
    expect(setCookie).toContain("Max-Age=86400")
    expect(setCookie).toContain("HttpOnly")
    expect(setCookie).toContain("SameSite=lax")
    expect(setCookie).toContain("Path=/")

    // Should log completion
    expect(mockSupabase.insert).toHaveBeenCalled()
  })

  it("does not set new cookie when session already exists", async () => {
    const stepUrl = "https://youtube.com/watch?v=123"
    mockSupabase.single.mockResolvedValue({
      data: { id: "step-1", url: stepUrl },
      error: null,
    })
    mockSupabase.insert.mockResolvedValue({ error: null })

    const req = createMockRequest("existing-session-id")
    const params = Promise.resolve({ stepId: "step-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(stepUrl)

    // Should NOT set new cookie
    const setCookie = response.headers.get("set-cookie")
    expect(setCookie).toBeNull()
  })

  it("returns 500 when unexpected error occurs", async () => {
    mockSupabase.single.mockRejectedValue(new Error("DB connection failed"))

    const req = createMockRequest()
    const params = Promise.resolve({ stepId: "step-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toBe("Internal server error")
  })
})
