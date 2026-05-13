import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AdminGateStepsForm from "@/components/admin/admin-gate-steps-form"

// Mock language context
vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en" as const,
    setLanguage: vi.fn(),
    t: (key: string) => key,
    messages: {},
  }),
}))

describe("AdminGateStepsForm", () => {
  it("shows empty state when no steps", () => {
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={[]} onChange={onChange} />)

    expect(screen.getByText(/no unlock steps/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add step/i })).toBeInTheDocument()
  })

  it("renders existing steps with their labels and URLs", () => {
    const steps = [
      { id: "s1", label: "Watch video", url: "https://youtu.be/test", sortOrder: 0 },
      { id: "s2", label: "Like page", url: "https://fb.com/test", sortOrder: 1 },
    ]
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={steps} onChange={onChange} />)

    expect(screen.getByDisplayValue("Watch video")).toBeInTheDocument()
    expect(screen.getByDisplayValue("https://youtu.be/test")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Like page")).toBeInTheDocument()
    expect(screen.getByDisplayValue("https://fb.com/test")).toBeInTheDocument()
  })

  it("adds new step when clicking Add button on empty state", () => {
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={[]} onChange={onChange} />)

    fireEvent.click(screen.getByRole("button", { name: /add step/i }))
    expect(onChange).toHaveBeenCalledTimes(1)
    const newSteps = onChange.mock.calls[0][0]
    expect(newSteps).toHaveLength(1)
    expect(newSteps[0].label).toBe("")
    expect(newSteps[0].url).toBe("")
  })

  it("removes a step when clicking delete button", () => {
    const steps = [
      { id: "s1", label: "Watch video", url: "https://youtu.be/test", sortOrder: 0 },
    ]
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={steps} onChange={onChange} />)

    const deleteButtons = screen.getAllByRole("button", { name: /delete step/i })
    expect(deleteButtons).toHaveLength(1)
    fireEvent.click(deleteButtons[0])
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toHaveLength(0)
  })

  it("updates step label when input changes", () => {
    const steps = [
      { id: "s1", label: "Old label", url: "https://youtu.be/test", sortOrder: 0 },
    ]
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={steps} onChange={onChange} />)

    const input = screen.getByDisplayValue("Old label")
    fireEvent.change(input, { target: { value: "New label" } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0][0].label).toBe("New label")
  })

  it("moves step up when clicking up arrow", () => {
    const steps = [
      { id: "s1", label: "First", url: "https://a.com", sortOrder: 0 },
      { id: "s2", label: "Second", url: "https://b.com", sortOrder: 1 },
    ]
    const onChange = vi.fn()
    render(<AdminGateStepsForm steps={steps} onChange={onChange} />)

    // Click up arrow on second step
    const upButtons = screen.getAllByRole("button", { name: /move up/i })
    expect(upButtons).toHaveLength(2)
    fireEvent.click(upButtons[1]) // second step's up button

    expect(onChange).toHaveBeenCalledTimes(1)
    const result = onChange.mock.calls[0][0]
    expect(result[0].id).toBe("s2")
    expect(result[1].id).toBe("s1")
  })
})
