import { LanguageProvider } from "@/context/language-context"
import { BlogProvider } from "@/context/blog-context"
import AdminDashboard from "@/components/admin-dashboard"

export default function Page() {
  return (
    <LanguageProvider>
      <BlogProvider>
        <AdminDashboard />
      </BlogProvider>
    </LanguageProvider>
  )
}
