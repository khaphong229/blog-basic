import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import GatedDownloadSection from "@/components/gate/gated-download-section"

// Mock language context
vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en" as const,
    setLanguage: vi.fn(),
    t: (key: string) => key,
    messages: {},
  }),
}))

const testResources = [
  {
    id: "res-1",
    postId: "post-1",
    title: "Source Code v2.0",
    type: "external" as const,
    filePath: null,
    fileName: null,
    fileSize: null,
    externalUrl: "https://bit.ly/example",
    sortOrder: 0,
    downloadCount: 0,
    createdAt: "2026-01-01T00:00:00Z",
    gateSteps: [
      { id: "s1", resourceId: "res-1", label: "Watch video", url: "https://youtu.be/1", sortOrder: 0 },
      { id: "s2", resourceId: "res-1", label: "Like page", url: "https://fb.com/1", sortOrder: 1 },
    ],
  },
  {
    id: "res-2",
    postId: "post-1",
    title: "PDF Guide",
    type: "external" as const,
    filePath: null,
    fileName: null,
    fileSize: null,
    externalUrl: "https://bit.ly/guide",
    sortOrder: 1,
    downloadCount: 0,
    createdAt: "2026-01-01T00:00:00Z",
    gateSteps: [],
  },
]

describe("GatedDownloadSection", () => {
  beforeEach(() => {
    // Default: all locked
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: {
          unlockedResourceIds: [],
          completedStepIds: [],
        },
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders nothing when resources array is empty", () => {
    const { container } = render(
      <GatedDownloadSection postId="post-1" resources={[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders resources with gate steps", async () => {
    render(
      <GatedDownloadSection postId="post-1" resources={testResources} />
    )

    // Should show resource titles
    await waitFor(() => {
      expect(screen.getByText("Source Code v2.0")).toBeInTheDocument()
      expect(screen.getByText("PDF Guide")).toBeInTheDocument()
    })

    // Should show gate steps for first resource
    await waitFor(() => {
      expect(screen.getByText("Watch video")).toBeInTheDocument()
      expect(screen.getByText("Like page")).toBeInTheDocument()
    })

    // Should fetch gate status
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/gate/status/post-1")
  })

  it("shows Unlocked badge when resource is unlocked", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: {
          unlockedResourceIds: ["res-1"],
          completedStepIds: ["s1", "s2"],
        },
      }),
    })

    render(
      <GatedDownloadSection postId="post-1" resources={testResources} />
    )

    await waitFor(() => {
      expect(screen.getByText("Source Code v2.0")).toBeInTheDocument()
    })
  })
})
