/**
 * Integration tests for GET /api/gate/status/[postId]
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// Mock data
const mockResources = [
  { id: "res-1", post_id: "post-1" },
  { id: "res-2", post_id: "post-1" },
  { id: "res-3", post_id: "post-1" },
]

const mockSteps = [
  { id: "s1", resource_id: "res-1" },
  { id: "s2", resource_id: "res-1" },
  { id: "s3", resource_id: "res-2" },
  // res-3 has no steps → auto-unlocked
]

const mockCompletions = [
  { step_id: "s1" },
  { step_id: "s3" },
]

// Mock the supabase server client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => mockSupabase),
}))

const { GET } = await import("@/app/api/gate/status/[postId]/route")

function createMockRequest(cookieValue?: string): NextRequest {
  const url = "http://localhost:3000/api/gate/status/post-1"
  const headers = new Headers()
  if (cookieValue) {
    headers.set("cookie", `gate_session=${cookieValue}`)
  }
  return new NextRequest(url, { headers })
}

describe("GET /api/gate/status/[postId]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns empty status when no session cookie", async () => {
    const req = createMockRequest()
    const params = Promise.resolve({ postId: "post-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.status.unlockedResourceIds).toEqual([])
    expect(body.status.completedStepIds).toEqual([])
  })

  it("returns empty status when post has no resources", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
            in: vi.fn(),
            order: vi.fn(),
          })),
        }
      }
      return { select: vi.fn().mockResolvedValue({ data: null, error: null }) }
    })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ postId: "post-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.status.unlockedResourceIds).toEqual([])
  })

  it("calculates correct unlock status with mixed completions", async () => {
    // Chain eq → returns this, then select → returns data
    const chainWithData = (data: any) => ({
      from: () => chainWithData(data),
      select: () => Promise.resolve({ data, error: null }),
      eq: () => chainWithData(data),
      in: () => Promise.resolve({ data, error: null }),
      order: () => chainWithData(data),
    })

    // Mock first query (resources)
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              error: null,
              data: mockResources.map(r => ({ id: r.id })),
            })),
            in: vi.fn(),
            order: vi.fn(),
          })),
          eq: vi.fn(),
          in: vi.fn(),
          order: vi.fn(),
        }
      }
      if (table === "gate_steps") {
        return {
          select: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({ data: mockSteps, error: null })),
          })),
          eq: vi.fn(),
          in: vi.fn().mockResolvedValue({ data: mockSteps, error: null }),
          order: vi.fn(),
        }
      }
      if (table === "gate_completions") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              in: vi.fn(() => Promise.resolve({ data: mockCompletions, error: null })),
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
        }
      }
      return {
        select: vi.fn().mockResolvedValue({ data: null, error: null }),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ data: null, error: null }),
        order: vi.fn().mockReturnThis(),
      }
    })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ postId: "post-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(200)
    const body = await response.json()

    // res-1: has 2 steps (s1, s2). s1 completed, s2 not → NOT unlocked
    // res-2: has 1 step (s3). s3 completed → unlocked
    // res-3: has 0 steps → auto-unlocked
    expect(body.status.completedStepIds).toContain("s1")
    expect(body.status.completedStepIds).toContain("s3")
    expect(body.status.completedStepIds).not.toContain("s2")
    expect(body.status.unlockedResourceIds).toContain("res-2")
    expect(body.status.unlockedResourceIds).toContain("res-3")
    expect(body.status.unlockedResourceIds).not.toContain("res-1")
  })

  it("returns 500 when resources query fails", async () => {
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "post_resources") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: "DB error", code: "PGRST301" },
            })),
          })),
          eq: vi.fn(),
          in: vi.fn(),
          order: vi.fn(),
        }
      }
      return {
        select: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const req = createMockRequest("test-session")
    const params = Promise.resolve({ postId: "post-1" })
    const response = await GET(req, { params })

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toContain("resources")
  })
})
