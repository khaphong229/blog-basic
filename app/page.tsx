import HomePage from "@/components/home-page"

/**
 * Homepage — no extra providers needed (already in layout.tsx)
 * Removed duplicate LanguageProvider + BlogProvider wrapping
 */
export default function Page() {
  return <HomePage />
}
