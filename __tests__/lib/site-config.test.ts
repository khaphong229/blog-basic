import { describe, it, expect } from "vitest"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config"

describe("Site Config", () => {
  it("exports SITE_URL", () => {
    expect(SITE_URL).toBeDefined()
    expect(typeof SITE_URL).toBe("string")
    expect(SITE_URL.startsWith("http")).toBe(true)
  })

  it("exports SITE_NAME", () => {
    expect(SITE_NAME).toBe("Dev Blog")
  })

  it("exports SITE_DESCRIPTION", () => {
    expect(SITE_DESCRIPTION).toBeDefined()
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(10)
  })
})
