# Developer Guide — Blog Basic

> **Mục tiêu**: Tài liệu này giúp bạn tự đọc, sửa code và debug dự án mà không cần AI. Nếu bạn thấy dự án phức tạp vì toàn bộ code được viết bởi AI, thì đây là "bản đồ" để bạn làm chủ nó.

---

## 1. Quick Start — Chạy project trong 5 phút

### 1.1 Yêu cầu

- **Node.js** >= 18
- **npm** (cài kèm Node.js)
- **Tài khoản Supabase** (database + auth miễn phí)
- **Git**

### 1.2 Cài đặt

```bash
# 1. Clone repo
git clone <repo-url> blog-basic
cd blog-basic

# 2. Cài dependencies
npm install

# 3. Tạo file .env.local từ mẫu
cp .env.example .env.local
```

### 1.3 Cấu hình Supabase

Mở `.env.local` và điền 3 giá trị từ Supabase dashboard (Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> **Quan trọng**: `SUPABASE_SERVICE_ROLE_KEY` là key admin, chỉ dùng ở server-side. KHÔNG BAO GIỜ thêm prefix `NEXT_PUBLIC_` vào key này.

### 1.4 Chạy development server

```bash
npm run dev
```

Mở trình duyệt: `http://localhost:3000`

### 1.5 Các lệnh quan trọng

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Chạy dev server (hot reload) |
| `npm run build` | Build production |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run lint:fix` | Tự sửa lỗi ESLint |
| `npm run type-check` | Kiểm tra lỗi TypeScript |
| `npm run test` | Chạy toàn bộ test |
| `npm run test:watch` | Chạy test + watch mode |
| `npm run format` | Format code bằng Prettier |

---

## 2. Project Map — Cấu trúc thư mục

Đây là "bản đồ" của toàn bộ project. Khi bạn cần tìm thứ gì đó, hãy dùng bảng này:

```
blog-basic/
├── app/                          # NEXT.JS APP ROUTER — định nghĩa URL
│   ├── layout.tsx                #   Root layout (font, providers, metadata)
│   ├── page.tsx                  #   Trang chủ "/"
│   ├── globals.css               #   CSS toàn cục (Tailwind v4 + design tokens)
│   ├── sitemap.ts                #   Sitemap XML (SEO)
│   ├── robots.ts                 #   robots.txt
│   ├── error.tsx                 #   Error boundary toàn cục
│   ├── loading.tsx               #   Loading spinner toàn cục
│   ├── not-found.tsx             #   Trang 404
│   ├── admin/                    #   Admin dashboard
│   │   ├── page.tsx              #     "/admin" — dashboard
│   │   ├── login/page.tsx        #     "/admin/login" — đăng nhập
│   │   ├── settings/page.tsx     #     "/admin/settings" — URL shortener
│   │   └── tags/page.tsx         #     "/admin/tags" — quản lý tags
│   ├── blog/[slug]/              #   Blog detail page
│   │   └── page.tsx              #     "/blog/ten-bai-viet" — chi tiết bài viết
│   ├── api/                      #   API routes (server-side)
│   │   ├── translate/route.ts    #     POST /api/translate — dịch AI
│   │   └── upload/route.ts      #     POST /api/upload — upload ảnh
│   ├── feed.xml/route.ts         #   RSS Feed
│   └── tiktok/page.tsx           #   TikTok landing page
│
├── components/                   # REACT COMPONENTS
│   ├── ui/                       #   shadcn/ui component (base UI)
│   │   ├── button.tsx            #     Nút bấm
│   │   ├── card.tsx              #     Card container
│   │   ├── dialog.tsx            #     Modal dialog
│   │   ├── input.tsx             #     Ô nhập text
│   │   ├── blog-card.tsx         #     Card bài viết (custom)
│   │   └── pagination.tsx        #     Phân trang
│   ├── navigation.tsx            #   Thanh điều hướng chính
│   ├── footer.tsx                #   Footer
│   ├── home-page.tsx             #   Trang chủ (hero + blog list)
│   ├── blog-post-detail.tsx      #   Nội dung bài viết
│   ├── blog-listing.tsx          #   Danh sách bài viết
│   ├── blog-detail-page.tsx      #   Wrapper trang chi tiết
│   ├── reading-progress.tsx      #   Thanh tiến trình đọc
│   ├── table-of-contents.tsx     #   Mục lục sidebar
│   ├── comments-section.tsx      #   Hệ thống bình luận
│   ├── theme-toggle.tsx          #   Nút chuyển light/dark
│   ├── language-selector.tsx     #   Nút chọn ngôn ngữ
│   ├── rich-text-editor.tsx      #   Editor Markdown (admin)
│   ├── image-upload.tsx          #   Upload ảnh (admin)
│   ├── author-select.tsx         #   Chọn tác giả (admin)
│   ├── admin-dashboard.tsx       #   Trang tổng quan admin
│   ├── admin-post-form.tsx       #   Form tạo bài viết mới
│   ├── admin-posts-list.tsx      #   Danh sách bài viết (admin)
│   ├── admin-edit-post-dialog.tsx#   Dialog sửa bài viết
│   ├── admin-settings.tsx        #   Trang cài đặt admin
│   ├── admin-tags.tsx            #   Quản lý tags
│   ├── admin-comments.tsx        #   Moderation bình luận
│   └── url-shortener-settings.tsx#   Cấu hình URL shortener
│
├── context/                      # STATE MANAGEMENT (React Context)
│   ├── blog-context.tsx          #   BlogProvider — gộp Posts + URL Shortener
│   ├── posts-context.tsx         #   PostsProvider — CRUD bài viết
│   ├── url-shortener-context.tsx #   UrlShortenerProvider — cấu hình short link
│   └── language-context.tsx      #   LanguageProvider — i18n (EN/VI)
│
├── lib/                          # UTILITIES & API LAYER
│   ├── supabase/                 #   Supabase client + types
│   │   ├── client.ts             #     Browser client
│   │   ├── server.ts             #     Server client
│   │   ├── admin.ts              #     Admin client (service role)
│   │   ├── middleware.ts         #     Auth middleware helper
│   │   ├── database.types.ts     #     Full DB type definitions
│   │   └── index.ts              #     Barrel export
│   ├── api/                      #   Data access layer
│   │   ├── posts.ts              #     Post CRUD (client)
│   │   ├── posts.server.ts       #     Post queries (server)
│   │   ├── comments.ts           #     Comment operations
│   │   ├── tags.ts               #     Tag CRUD
│   │   ├── translation.ts        #     AI translation
│   │   ├── url-shortener.ts      #     URL shortener CRUD
│   │   ├── tiktok.server.ts      #     TikTok lookup
│   │   └── index.ts              #     Barrel export
│   ├── i18n.ts                   #   Hàm translate() + getTranslations()
│   └── utils.ts                  #   Tiện ích chung
│
├── hooks/                        # CUSTOM REACT HOOKS
│   ├── useMounted.ts             #   Kiểm tra client-side mount
│   ├── useDebounce.ts            #   Debounce value
│   ├── useLocalStorage.ts        #   localStorage có SSR support
│   └── useMediaQuery.ts          #   CSS media query trong JS
│
├── types/                        # TYPESCript TYPE DEFINITIONS
│   └── blog.ts                   #   BlogPost, Comment, URLShortenerConfig, URLLog
│
├── messages/                     # i18n TRANSLATIONS
│   ├── en.json                   #   English texts
│   └── vi.json                   #   Vietnamese texts
│
├── supabase/                     # DATABASE MIGRATIONS
│   └── migrations/               #   SQL migration files (001, 002, ...)
│
├── public/                       # STATIC FILES (favicon, images)
├── __tests__/                    # UNIT & INTEGRATION TESTS
├── plans/                        # Kế hoạch phát triển
├── docs/                         # Tài liệu dự án
├── .env.example                  # Mẫu file biến môi trường
├── .env.local                    # File biến môi trường thực tế (bị .gitignore)
├── package.json                  # Dependencies + scripts
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── vitest.config.ts              # Vitest test config
├── eslint.config.mjs             # ESLint config
├── middleware.ts                 # Next.js middleware (auth refresh)
└── AGENTS.md                     # Rules cho AI agent
```

### Cách tìm nhanh thứ bạn cần:

| Bạn muốn... | Nhìn ở đây |
|-------------|------------|
| Sửa giao diện trang chủ | `components/home-page.tsx` |
| Sửa bài viết chi tiết | `components/blog-post-detail.tsx` |
| Sửa navigation bar | `components/navigation.tsx` |
| Sửa footer | `components/footer.tsx` |
| Thêm/Sửa API endpoint | `app/api/*/route.ts` |
| Sửa logic lấy dữ liệu | `lib/api/posts.ts` hoặc `posts.server.ts` |
| Sửa state management | `context/posts-context.tsx` |
| Thêm ngôn ngữ mới | `messages/` + `context/language-context.tsx` + `lib/i18n.ts` |
| Sửa database schema | `supabase/migrations/` |
| Sửa kiểu dữ liệu | `types/blog.ts` |
| Sửa auth flow | `middleware.ts` + `lib/supabase/middleware.ts` |
| Debug lỗi build | Chạy `npm run type-check` + `npm run lint` |
| Debug lỗi runtime | Mở Console (F12) + Network tab |

---

## 3. Reading the Code — Cách đọc code hiệu quả

### 3.1 Kiến trúc tổng quan

Project này dùng **Next.js App Router** với kiến trúc phân tầng rõ ràng. Hãy hiểu các tầng này:

```
┌─────────────────────────────────────────────┐
│  BROWSER                                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ app/page │  │components│  │ context/   │ │
│  │ (routing)│←─│(UI-only) │←─│ (state)   │ │
│  └──────────┘  └──────────┘  └─────┬──────┘ │
│                                    │        │
│                              ┌─────┴──────┐ │
│                              │ lib/api/   │ │
│                              │ (data CRUD)│ │
│                              └─────┬──────┘ │
└────────────────────────────────────┼────────┘
                                     │
┌────────────────────────────────────┼────────┐
│  NETWORK                          │        │
│                            ┌──────┴──────┐ │
│                            │  Supabase   │ │
│                            │  (Postgres)  │ │
│                            └─────────────┘ │
└─────────────────────────────────────────────┘

SERVER-SIDE (song song):
┌─────────────────────────────────────────────┐
│  SERVER                                     │
│  ┌──────────┐  ┌──────────────┐            │
│  │ app/api/ │  │lib/supabase/ │            │
│  │(routes)  │←─│server.ts     │            │
│  └──────────┘  │lib/api/*.ser │            │
│                └──────────────┘            │
│  ┌──────────┐                              │
│  │middleware│                              │
│  │.ts (auth)│                              │
│  └──────────┘                              │
└─────────────────────────────────────────────┘
```

**Nguyên tắc quan trọng**:
- File `*.tsx` có `"use client"` ở đầu -> chạy trên browser. Có thể dùng hooks, state, event handlers.
- File `*.tsx` KHÔNG có `"use client"` -> Server Component. Chạy trên server, không dùng hooks/state được.
- `"use client"` ở đâu? Tìm bằng cách: `grep "use client"` trong project.

### 3.2 Data flow — Dữ liệu chạy như thế nào?

Đây là flow quan trọng nhất bạn cần hiểu:

```
1. SERVER COMPONENT (SEO)
   app/blog/[slug]/page.tsx
   │
   ├── gọi getPostBySlugServer()  ← lib/api/posts.server.ts
   │   └── query Supabase (server client)
   │
   ├── generateMetadata() → SEO tags
   │
   └── render <BlogPostDetail post={post} />


2. CLIENT COMPONENT (Interactive)
   components/blog-post-detail.tsx
   │
   ├── Nhận post từ props (từ server)
   │
   ├── Dùng useBlog() để lấy posts từ context
   │   └── context/blog-context.tsx
   │       └── PostsProvider + UrlShortenerProvider
   │
   └── Render markdown, TOC, comments...


3. STATE MANAGEMENT (Global)
   context/posts-context.tsx
   │
   ├── posts: BlogPost[]       ← state chính
   ├── isLoading, error         ← trạng thái
   │
   ├── fetchPosts()            ← gọi Supabase, build posts + tags + comments
   ├── addPost(data)           ← insert vào DB + auto-translate
   ├── updatePost(id, data)    ← update DB + sync linked post
   ├── deletePost(id)          ← xóa khỏi DB
   │
   └── getPostBySlug(slug)     ← filter in-memory
       searchPosts(query)      ← search in-memory
```

### 3.3 Cách trace một tính năng

Ví dụ: Bạn muốn hiểu cách tính năng "Tạo bài viết mới" hoạt động:

1. **Bắt đầu từ UI**: Mở `components/admin-post-form.tsx` -> thấy form gọi `addPost()`
2. **Truy nguồn hàm**: `addPost` đến từ `useBlog()` -> `context/blog-context.tsx` -> re-export từ `PostsContext`
3. **Đọc implementation**: `context/posts-context.tsx` -> hàm `addPost()`
4. **Theo dõi DB call**: Hàm gọi `createPost()` -> `lib/api/posts.ts` -> Supabase `insert`
5. **Xem side effects**: Sau khi insert, code gọi `translatePost()` -> `lib/api/translation.ts` -> `fetch('/api/translate')`

**Quy tắc tracing**: UI → Hook/Context → API function → Database

---

## 4. Making Changes — Các tác vụ phổ biến

### 4.1 Thêm một component mới

1. Tạo file trong `components/`
2. Nếu cần state/hooks/event: thêm `"use client"` ở đầu file
3. Import shadcn/ui component nếu cần từ `components/ui/`
4. Style bằng Tailwind CSS classes

```tsx
// components/my-new-component.tsx
"use client"

import { Button } from "@/components/ui/button"

export function MyNewComponent() {
  return (
    <div className="rounded-lg border p-4">
      <Button>Click me</Button>
    </div>
  )
}
```

### 4.2 Thêm một trang mới

1. Tạo thư mục trong `app/` (vd: `app/about/`)
2. Tạo `page.tsx` bên trong:

```tsx
// app/about/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "About our blog"
}

export default function AboutPage() {
  return (
    <main className="container mx-auto py-8">
      <h1>About Us</h1>
    </main>
  )
}
```

3. URL tự động là `/about`

### 4.3 Thêm một API endpoint

Tạo `app/api/tên/route.ts`:

```tsx
// app/api/my-endpoint/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Hello" })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### 4.4 Sửa dữ liệu hiển thị trên trang

1. **Dữ liệu từ server**: Sửa trong `lib/api/posts.server.ts` (các hàm `getXxxServer`)
2. **Dữ liệu từ client context**: Sửa trong `lib/api/posts.ts` (các hàm gọi Supabase)
3. **Format dữ liệu**: Mapping DB type -> frontend type nằm trong `context/posts-context.tsx` (hàm `mapSupabasePostToBlogPost`)

### 4.5 Sửa text giao diện (i18n)

1. Mở `messages/en.json` và `messages/vi.json`
2. Tìm key cần sửa (vd: `"nav.home": "Home"`)
3. Sửa value tương ứng
4. Trong component, gọi: `const { t } = useLanguage()` rồi `t("nav.home")`

### 4.6 Thêm ngôn ngữ mới cho text

1. Thêm key mới vào `messages/en.json`
2. Thêm key tương tự vào `messages/vi.json`
3. Trong code, dùng `t("key.mới")`

### 4.7 Sửa cấu trúc database

1. Tạo migration mới trong `supabase/migrations/` (file SQL)
2. Cập nhật types trong `lib/supabase/database.types.ts`
3. Cập nhật `types/blog.ts` nếu ảnh hưởng frontend
4. Cập nhật các hàm API trong `lib/api/`
5. Cập nhật mapping trong `context/posts-context.tsx`

### 4.8 Sửa màu sắc / theme

1. **Global colors**: Sửa CSS variables trong `app/globals.css` (phần `@theme` hoặc `:root`)
2. **Component colors**: Sửa Tailwind classes trực tiếp trong component
3. **Dark mode**: Tìm selector `.dark` trong `globals.css`

---

## 5. Debugging — Cách debug hiệu quả

### 5.1 Debug UI trước tiên

Mở Chrome DevTools (F12):

- **Console tab**: Xem lỗi JavaScript, `console.log` output
- **Network tab**: Xem API calls, response từ Supabase
- **Elements tab**: Inspect HTML/CSS, xem classes nào đang active
- **React DevTools** (extension): Xem component tree, props, state

### 5.2 Debug data (Supabase)

Vào Supabase Dashboard > Table Editor để:

- Xem trực tiếp dữ liệu trong bảng `posts`, `tags`, `comments`
- Kiểm tra RLS policies (Authentication > Policies)
- Xem logs (Database > Logs)

### 5.3 Debug lỗi phổ biến

| Lỗi | Nguyên nhân có thể | Cách fix |
|-----|-------------------|----------|
| `Module not found: Can't resolve '@/...'` | Path alias sai | Kiểm tra `@/` trỏ đến đúng file, file có tồn tại không |
| `useLanguage must be used within LanguageProvider` | Context wrapping sai | Provider phải wrap component trong layout.tsx |
| `Hydration failed` | Server/client render khác nhau | Dùng `useMounted()` hoặc `suppressHydrationWarning` |
| `Supabase - relation does not exist` | Bảng chưa được tạo | Chạy migration trong Supabase |
| `fetch failed` | URL sai hoặc CORS | Kiểm tra `.env.local` và Network tab |
| `Type 'X' is not assignable to type 'Y'` | Type mismatch | Chạy `npm run type-check` để xem chi tiết |
| Trang trắng (white screen) | Lỗi JavaScript runtime | Mở Console (F12), đọc error đầu tiên |
| Bài viết không hiển thị | status != "published" hoặc RLS | Kiểm tra `status` trong Supabase, kiểm tra RLS policy |

### 5.4 Debug context/state

Thêm tạm `console.log` vào context để xem state:

```tsx
// Trong posts-context.tsx, thêm:
console.log("Current posts:", posts)
```

Hoặc dùng React DevTools để inspect state trực tiếp.

### 5.5 Debug Supabase queries

Mở Network tab, lọc `XHR/Fetch`, tìm request đến `supabase.co`. Xem:
- **Request URL**: Query gì đang được gọi
- **Response**: Dữ liệu trả về có đúng không
- **Status**: 200 (OK), 401 (Unauthorized - RLS), 500 (Server error)

### 5.6 Debug lỗi build

```bash
# Kiểm tra type errors trước
npm run type-check

# Nếu có lỗi, đọc từng dòng. Lỗi TypeScript thường rất rõ ràng về:
# - File nào bị lỗi (đường dẫn)
# - Dòng nào bị lỗi (line number)
# - Type nào không khớp

# Kiểm tra lint errors
npm run lint
```

### 5.7 Debug lỗi test

```bash
# Chạy 1 file test cụ thể
npx vitest run __tests__/tên-file.test.ts

# Chạy với UI (dễ xem hơn)
npx vitest --ui
```

---

## 6. Testing — Cách viết và chạy test

### 6.1 Chạy test

```bash
npm run test              # Chạy tất cả test 1 lần
npm run test:watch        # Auto re-run khi code thay đổi
```

### 6.2 Cấu trúc test

Tests nằm trong `__tests__/` với cấu trúc mirror source code:

```
__tests__/
├── setup.ts                 # Test setup (jest-dom matchers)
├── lib/
│   ├── i18n.test.ts         # Test hàm translate()
│   ├── site-config.test.ts  # Test SITE_URL, SITE_NAME
│   └── structured-data.test.ts  # Test JSON-LD generation
└── components/
    └── pagination.test.tsx  # Test Pagination component
```

### 6.3 Viết test mới

```tsx
// __tests__/components/my-component.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MyComponent } from "@/components/my-component"

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
```

### 6.4 Test với context provider

Nếu component dùng `useBlog()` hoặc `useLanguage()`, bạn cần wrap:

```tsx
import { BlogProvider } from "@/context/blog-context"
import { LanguageProvider } from "@/context/language-context"

render(
  <LanguageProvider>
    <BlogProvider>
      <MyComponent />
    </BlogProvider>
  </LanguageProvider>
)
```

---

## 7. Cheat Sheet — Các lệnh thường dùng

### VS Code shortcuts hữu ích

| Phím | Tác dụng |
|------|----------|
| `Ctrl+P` | Mở nhanh file (gõ tên file) |
| `Ctrl+Shift+F` | Search toàn project |
| `Ctrl+Click` | Go to definition |
| `F12` | Go to definition (cách khác) |
| `Shift+F12` | Find all references |
| `Ctrl+Shift+O` | Go to symbol trong file |

### Search nhanh với grep

```bash
# Tìm tất cả file có dùng "use client"
grep -r "use client" --include="*.tsx"

# Tìm tất cả chỗ gọi useBlog()
grep -r "useBlog()" --include="*.tsx"

# Tìm tất cả API routes
grep -r "export async function" --include="route.ts"
```

### Cách xem git history

```bash
git log --oneline -20         # 20 commits gần nhất
git log --oneline -- app/     # Commits ảnh hưởng thư mục app/
git diff HEAD~1               # Xem thay đổi ở commit trước
git blame file.tsx            # Ai/code nào sửa từng dòng
```

---

## 8. Key Workflows — Các luồng quan trọng

### 8.1 Flow tạo bài viết mới

```
AdminPostForm (UI)
  → addPost() trong PostsContext
    → generateSlug(title) → tạo slug từ tiêu đề
    → createPost() → INSERT vào Supabase bảng posts
    → handleTags() → INSERT/UPDATE tags + post_tags
    → createShortUrl() → INSERT shortened_urls
    → (non-blocking) translatePost()
        → POST /api/translate (Groq AI)
        → createPost() cho ngôn ngữ còn lại
        → UPDATE linked_post_id (liên kết 2 chiều)
    → refreshPosts() → fetch lại toàn bộ posts
```

### 8.2 Flow hiển thị bài viết

```
User truy cập /blog/ten-bai-viet
  → app/blog/[slug]/page.tsx (Server Component)
    → getPostBySlugServer(slug)
      → Supabase: posts + post_tags + tags + comments
      → map sang BlogPost type
    → generateMetadata(post) → SEO tags
    → incrementViewCountServer(post.id) → fire & forget
    → render:
      ├── <BlogPostDetail post={post} />
      │   ├── react-markdown render nội dung
      │   ├── ReadingProgress bar
      │   ├── TableOfContents sidebar
      │   └── Share buttons + copy link
      ├── <CommentsSection postId={post.id} />
      │   ├── useBlog().addComment()
      │   └── render comments list
      └── JSON-LD structured data
```

### 8.3 Flow chuyển ngôn ngữ

```
User click nút EN/VI trên navigation
  → setLanguage("vi") trong LanguageContext
  → Tất cả component re-render
  → t("key") trả về text tiếng Việt
  → BlogListing filter posts theo language mới
```

### 8.4 Flow đăng nhập admin

```
User truy cập /admin
  → middleware.ts kiểm tra session
  → Nếu chưa login → redirect /admin/login
  → Login page: email + password
    → supabase.auth.signInWithPassword()
    → Nếu OK → redirect /admin
    → Nếu fail → hiện lỗi
  → Admin page: supabase.auth.getUser() xác thực
  → Sign out: supabase.auth.signOut()
```

### 8.5 Flow tự động dịch bài viết

```
Khi tạo bài viết mới (vd: tiếng Việt):
  → translatePost() gọi POST /api/translate
    → Body: { title, excerpt, content, tags, sourceLang: "vi" }
    → Server: gọi Groq API (model gemma2-9b-it)
    → Fallback models nếu lỗi
    → Return: { title, excerpt, content, tags } đã dịch
  → createPost() cho bản tiếng Anh
    → linkedPostId trỏ đến bài gốc
  → UPDATE bài gốc: linkedPostId trỏ đến bản dịch
```

---

## 9. Quick Reference — File quan trọng nhất

Nếu bạn chỉ nhớ 10 file, hãy nhớ những file này:

| # | File | Tại sao quan trọng |
|---|------|-------------------|
| 1 | `app/layout.tsx` | Root của mọi trang, providers, metadata |
| 2 | `context/posts-context.tsx` | Trung tâm state của blog |
| 3 | `lib/api/posts.ts` | Tất cả query Supabase cho posts |
| 4 | `components/home-page.tsx` | Trang chủ |
| 5 | `components/blog-post-detail.tsx` | Trang chi tiết bài viết |
| 6 | `components/navigation.tsx` | Thanh menu chính |
| 7 | `middleware.ts` | Auth check mỗi request |
| 8 | `messages/en.json` | Tất cả text tiếng Anh |
| 9 | `types/blog.ts` | Tất cả type definitions |
| 10 | `app/globals.css` | Tất cả CSS/theme |

---

## 10. Common Pitfalls — Cạm bẫy thường gặp

1. **"use client" quên thêm**: Nếu bạn dùng `useState`, `useEffect`, `onClick` trong component mà quên `"use client"` ở đầu file, Next.js sẽ báo lỗi.

2. **Import sai path alias**: Luôn dùng `@/` thay vì relative path `../../`. Ví dụ: `import { Button } from "@/components/ui/button"`.

3. **Server Component không thể gọi hooks**: Nếu file không có `"use client"`, bạn KHÔNG thể dùng `useState`, `useEffect`, `useContext`, v.v.

4. **Database types vs Frontend types**: Database dùng `snake_case` (vd: `featured_image`), frontend dùng `camelCase` (vd: `featuredImage`). Mapping nằm trong `posts-context.tsx`.

5. **Supabase RLS**: Nếu query trả về rỗng dù có dữ liệu, kiểm tra RLS policies trong Supabase dashboard.

6. **ENV variables**: Biến `NEXT_PUBLIC_*` có thể dùng ở client và server. Biến không có prefix này CHỈ dùng ở server.

7. **Hydration errors**: Xảy ra khi HTML server render khác với client render. Thường do `Date`, `Math.random()`, hoặc `localStorage`. Dùng `useMounted()` để tránh.

8. **next-themes hydration**: Component dùng theme phải check `mounted` state trước khi render theme-dependent UI.

---

> **Lời khuyên**: Khi gặp bug, đừng panic. Mở Console (F12), đọc error message đầu tiên, rồi trace code từ UI → Context → API → Database theo hướng dẫn ở mục 3.3. 90% bugs có thể tìm thấy bằng cách này.
