import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import GateStepItem from "@/components/gate/gate-step-item"

// Mock language context
vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en" as const,
    setLanguage: vi.fn(),
    t: (key: string) => key,
    messages: {},
  }),
}))

const mockStep = {
  id: "step-1",
  label: "📺 Watch tutorial video",
  url: "https://youtube.com/watch?v=123",
}

describe("GateStepItem", () => {
  it("renders incomplete state with clickable button", () => {
    const onComplete = vi.fn()
    render(<GateStepItem step={mockStep} completed={false} onComplete={onComplete} />)

    expect(screen.getByText("📺 Watch tutorial video")).toBeInTheDocument()
    expect(screen.getByRole("button")).not.toBeDisabled()
  })

  it("renders complete state with disabled button and Done badge", () => {
    const onComplete = vi.fn()
    render(<GateStepItem step={mockStep} completed={true} onComplete={onComplete} />)

    expect(screen.getByText("📺 Watch tutorial video")).toBeInTheDocument()
    expect(screen.getByText("Done")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("calls onComplete when clicked in incomplete state", () => {
    const onComplete = vi.fn()

    // Mock window.open
    const originalOpen = window.open
    window.open = vi.fn()

    render(<GateStepItem step={mockStep} completed={false} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole("button"))
    expect(onComplete).toHaveBeenCalledWith("step-1")
    expect(window.open).toHaveBeenCalledWith("/api/gate/redirect/step-1", "_blank")

    // Restore
    window.open = originalOpen
  })

  it("does not call onComplete when clicked in complete state", () => {
    const onComplete = vi.fn()
    render(<GateStepItem step={mockStep} completed={true} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole("button"))
    expect(onComplete).not.toHaveBeenCalled()
  })
})
