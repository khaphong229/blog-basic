import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import DownloadButton from "@/components/gate/download-button"

// Mock language context
vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en" as const,
    setLanguage: vi.fn(),
    t: (key: string) => key,
    messages: {},
  }),
}))

const lockedResource = {
  id: "res-1",
  postId: "post-1",
  title: "Source Code",
  type: "external" as const,
  filePath: null,
  fileName: null,
  fileSize: null,
  externalUrl: "https://bit.ly/example",
  sortOrder: 0,
  downloadCount: 0,
  createdAt: "2026-01-01T00:00:00Z",
  gateSteps: [
    { id: "s1", resourceId: "res-1", label: "Step 1", url: "https://youtu.be/1", sortOrder: 0 },
    { id: "s2", resourceId: "res-1", label: "Step 2", url: "https://youtu.be/2", sortOrder: 1 },
  ],
}

const unlockedResource = {
  ...lockedResource,
  gateSteps: [],
}

describe("DownloadButton", () => {
  it("renders locked state with disabled button", () => {
    render(<DownloadButton resource={lockedResource} unlocked={false} />)

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent(/complete/i)
  })

  it("renders unlocked state with active button", () => {
    render(<DownloadButton resource={unlockedResource} unlocked={true} />)

    const button = screen.getByRole("button")
    expect(button).not.toBeDisabled()
    expect(button).toHaveTextContent(/download/i)
  })

  it("navigates to download API on click when unlocked", () => {
    // Mock window.location
    const originalLocation = window.location
    const mockLocation = { ...window.location, href: "" }
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    })

    render(<DownloadButton resource={unlockedResource} unlocked={true} />)
    fireEvent.click(screen.getByRole("button"))
    expect(mockLocation.href).toBe("/api/gate/download/res-1")

    // Restore
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    })
  })
})
