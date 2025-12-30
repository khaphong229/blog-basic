import { BlogProvider } from "@/context/blog-context"
import { LanguageProvider } from "@/context/language-context"
import BlogDetailPage from "@/components/blog-detail-page"

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <LanguageProvider>
      <BlogProvider>
        <BlogDetailPage slug={params.slug} />
      </BlogProvider>
    </LanguageProvider>
  )
}
