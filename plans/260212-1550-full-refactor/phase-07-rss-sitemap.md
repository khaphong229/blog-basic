# Phase 07: RSS Feed, Sitemap & SEO

Status: ✅ Complete
Dependencies: Phase 02 (Server Components)

## Objective

Thêm RSS feed, sitemap.xml tự động, và cải thiện SEO metadata cho toàn bộ blog.

## Requirements

### Functional
- [ ] RSS feed tại `/feed.xml` (chuẩn RSS 2.0)
- [ ] Sitemap tại `/sitemap.xml` (tự động từ posts)
- [ ] robots.txt cấu hình đúng
- [ ] JSON-LD structured data cho blog posts

### Non-Functional
- [ ] RSS feed tự động cập nhật khi có bài mới
- [ ] Sitemap bao gồm tất cả published posts
- [ ] Google Search Console có thể index

## Implementation Steps

1. [x] **Tạo RSS feed** — `app/feed.xml/route.ts` (RSS 2.0, cached 1h)
2. [x] **Tạo Sitemap** — `app/sitemap.ts` (Next.js built-in, auto from posts)
3. [x] **Tạo robots.txt** — `app/robots.ts` (blocks /admin/ + /api/)
4. [x] **Thêm JSON-LD** — `lib/structured-data.ts` + injected in blog detail page
5. [x] **Site config** — `lib/site-config.ts` (centralized URL/name constants)

## Files to Create/Modify

- `[NEW] app/feed.xml/route.ts` — RSS feed handler
- `[NEW] app/sitemap.ts` — Auto-generated sitemap
- `[NEW] app/robots.ts` — Robots.txt config
- `[NEW] lib/structured-data.ts` — JSON-LD helpers
- `[MODIFY] app/blog/[slug]/page.tsx` — Add JSON-LD + canonical
- `[MODIFY] app/layout.tsx` — Add alternate language links

## Test Criteria

- [ ] `/feed.xml` trả về valid RSS XML
- [ ] `/sitemap.xml` liệt kê tất cả published posts
- [ ] `/robots.txt` có nội dung đúng
- [ ] Blog post page có JSON-LD trong `<script>` tag
- [ ] Google Rich Results Test pass cho blog post

---
Next Phase: [Phase 08 - Bug Fixes & Polish](./phase-08-bugfixes.md)
