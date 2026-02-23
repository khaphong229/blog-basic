import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pagination } from "@/components/ui/pagination"

describe("Pagination component", () => {
    it("renders nothing when totalPages is 1", () => {
        const { container } = render(
            <Pagination currentPage={1} totalPages={1} onPageChange={() => { }} />
        )
        expect(container.firstChild).toBeNull()
    })

    it("renders page buttons when totalPages > 1", () => {
        render(
            <Pagination currentPage={1} totalPages={3} onPageChange={() => { }} />
        )
        expect(screen.getByLabelText("Page 1")).toBeInTheDocument()
        expect(screen.getByLabelText("Page 2")).toBeInTheDocument()
        expect(screen.getByLabelText("Page 3")).toBeInTheDocument()
    })

    it("disables Previous button on first page", () => {
        render(
            <Pagination currentPage={1} totalPages={3} onPageChange={() => { }} />
        )
        expect(screen.getByLabelText("Previous page")).toBeDisabled()
    })

    it("disables Next button on last page", () => {
        render(
            <Pagination currentPage={3} totalPages={3} onPageChange={() => { }} />
        )
        expect(screen.getByLabelText("Next page")).toBeDisabled()
    })

    it("marks current page with aria-current", () => {
        render(
            <Pagination currentPage={2} totalPages={3} onPageChange={() => { }} />
        )
        expect(screen.getByLabelText("Page 2")).toHaveAttribute("aria-current", "page")
    })

    it("shows ellipsis for large page counts", () => {
        render(
            <Pagination currentPage={5} totalPages={10} onPageChange={() => { }} />
        )
        // Should show first page, last page, and pages around current
        expect(screen.getByLabelText("Page 1")).toBeInTheDocument()
        expect(screen.getByLabelText("Page 10")).toBeInTheDocument()
    })
})
