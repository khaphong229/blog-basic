# Phase 02: Server Components & Performance

Status: 🟡 Code Complete (Manual step: Run migration 005)
Dependencies: Phase 01 (Auth)

## Objective

Chuyển từ full Client Components → Server/Client split chuẩn Next.js. Blog pages sẽ được server-rendered cho SEO và performance. Chỉ interactive parts (search, forms, animations) ở client.

## Requirements

### Functional
- [ ] Blog listing page render trên server (SEO-friendly HTML)
- [ ] Blog detail page render trên server với metadata động
- [ ] Homepage hero section giữ client-side animations
- [ ] Admin pages vẫn là Client Components (interactive)
- [ ] Search vẫn hoạt động client-side

### Non-Functional
- [ ] First Contentful Paint giảm ≥30%
- [ ] Google bot crawl được nội dung blog
- [ ] Trang blog không cần JavaScript để hiển thị nội dung

## Implementation Steps

1. [x] **Tạo server-side data fetching** — `lib/api/posts.server.ts` dùng server Supabase client
2. [x] **Refactor `/` (homepage)** — Server Component wrapper, truyền data xuống Client Components
3. [x] **Refactor `/blog/[slug]`** — Hoàn toàn Server Component, chỉ Comments là client
4. [x] **Tạo dynamic metadata** — `generateMetadata()` cho blog posts (title, description, OG)
5. [x] **Fix N+1 query** — Dùng batch fetch thay vì query loop
6. [x] **Fix `incrementViewCount`** — Dùng Supabase RPC function (atomic operation)
7. [x] **Tạo loading states** — `loading.tsx` cho mỗi route segment
8. [x] **Tạo error boundaries** — `error.tsx` + `not-found.tsx` cho mỗi route
9. [ ] **Static generation cho homepage** — `revalidate` option cho ISR (skipped: homepage uses client context)
10. [x] **Remove duplicate context wrapping** — Fix `page.tsx` wrap providers lần 2

## Files to Create/Modify

- `[NEW] lib/api/posts.server.ts` — Server-side data fetching
- `[NEW] app/loading.tsx` — Root loading state
- `[NEW] app/error.tsx` — Root error boundary
- `[NEW] app/not-found.tsx` — 404 page
- `[NEW] app/blog/[slug]/loading.tsx` — Blog detail loading
- `[NEW] app/blog/[slug]/error.tsx` — Blog detail error
- `[MODIFY] app/page.tsx` — Server Component wrapper, remove duplicate providers
- `[MODIFY] app/blog/[slug]/page.tsx` — Server Component with `generateMetadata`
- `[MODIFY] lib/api/posts.ts` — Fix N+1 with JOIN queries
- `[MODIFY] components/blog-listing.tsx` — Accept server-fetched data as props

## Test Criteria

- [ ] `curl http://localhost:3000/blog/[slug]` trả về HTML có nội dung bài viết
- [ ] View Source của blog page có `<h1>` với title
- [ ] Blog pages có `<meta>` tags đúng (og:title, description)
- [ ] Search vẫn hoạt động (filter client-side)
- [ ] View count tăng khi mở bài viết
- [ ] Error page hiển thị khi truy cập slug không tồn tại

---
Next Phase: [Phase 03 - i18n Refactor](./phase-03-i18n.md)
