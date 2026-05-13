/**
 * Integration tests for GET /api/gate/download/[resourceId]
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  single: vi.fn(),
  rpc: vi.fn().mockReturnThis(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => mockSupabase),
}))

const { GET } = await import("@/app/api/gate/download/[resourceId]/route")

function createMockRequest(cookieValue?: string): NextRequest {
  const url = "http://localhost:3000/api/gate/download/res-1"
  const headers = new Headers()
  if (cookieValue) {
    headers.set("cookie", `gate_session=${cookieValue}`)
  }
  return new NextRequest(url, { headers })
}

const mockResource = {
  id: "res-1",
  post_id: "post-1",
  title: "Source Code",
  type: "external",
  file_path: null,
  file_name: null,
  file_size: null,
  external_url: "https://bit.ly/example",
  sort_order: 0,
  download_count: 0,
  created_at: "2026-01-01T00:00:00Z",
}

describe("GET /api/gate/download/[resourceId]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 403 when no session cookie", async () => {
    const req = createMockRequest()
    const params = Promise.resolve({ resourceId: "res-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body.error).toContain("session")
  })

  it("returns 404 when resource is not found", async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: "Not found", code: "PGRST116" },
    })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ resourceId: "non-existent" })
    const response = await GET(req, { params })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe("Resource not found")
  })

  it("returns 403 when steps are not all completed", async () => {
    // Resource found
    mockSupabase.single.mockResolvedValue({
      data: mockResource,
      error: null,
    })

    // Has 2 steps
    const stepResult = { data: [{ id: "s1" }, { id: "s2" }], error: null }
    // Only 1 completed
    const compResult = { data: [{ step_id: "s1" }], error: null }

    // Mock chained calls
    let callCount = 0
    mockSupabase.eq.mockImplementation(function (this: any, field: string) {
      callCount++
      return this
    })
    mockSupabase.in.mockImplementation(function (this: any, field: string) {
      return Promise.resolve(compResult)
    })
    mockSupabase.select.mockImplementation(function (this: any) {
      return {
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue(compResult),
        single: vi.fn().mockResolvedValue({ data: mockResource, error: null }),
      }
    })

    // Override the steps query specifically
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: mockResource, error: null }),
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
          order: vi.fn(),
        }
      }
      if (table === "gate_steps") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve(stepResult)),
          })),
          eq: vi.fn(),
          in: vi.fn(),
        }
      }
      if (table === "gate_completions") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              in: vi.fn(() => Promise.resolve(compResult)),
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
        }
      }
      return { select: vi.fn().mockResolvedValue({ data: null, error: null }) }
    })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ resourceId: "res-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body.error).toContain("steps")
  })

  it("returns 302 redirect when resource is unlocked (external type)", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: mockResource, error: null }),
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
          order: vi.fn(),
        }
      }
      if (table === "gate_steps") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
        }
      }
      return { select: vi.fn().mockResolvedValue({ data: null, error: null }) }
    })

    mockSupabase.rpc.mockResolvedValue({ error: null })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ resourceId: "res-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(mockResource.external_url)

    // Should increment download count
    expect(mockSupabase.rpc).toHaveBeenCalledWith(
      "increment_resource_download_count",
      { res_id: "res-1" }
    )
  })

  it("returns 501 for upload type resources (not yet implemented)", async () => {
    const uploadResource = { ...mockResource, type: "upload" }
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: uploadResource, error: null }),
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
          order: vi.fn(),
        }
      }
      if (table === "gate_steps") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
        }
      }
      return { select: vi.fn().mockResolvedValue({ data: null, error: null }) }
    })

    mockSupabase.rpc.mockResolvedValue({ error: null })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ resourceId: "res-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(501)
  })
})
