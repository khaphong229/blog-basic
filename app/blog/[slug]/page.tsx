import { BlogProvider } from "@/context/blog-context"
import { LanguageProvider } from "@/context/language-context"
import BlogDetailPage from "@/components/blog-detail-page"

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  return (
    <LanguageProvider>
      <BlogProvider>
        <BlogDetailPage slug={params.slug} />
      </BlogProvider>
    </LanguageProvider>
  )
}
