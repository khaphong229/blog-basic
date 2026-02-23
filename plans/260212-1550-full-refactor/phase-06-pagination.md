# Phase 06: Pagination & UX Polish

Status: ✅ Complete
Dependencies: Phase 02, Phase 04

## Objective

Thêm pagination cho blog listing (hiện tại load tất cả) và cải thiện UX tổng thể.

## Requirements

### Functional
- [ ] Blog listing phân trang (10 posts/page)
- [ ] URL-based pagination (`?page=2`)
- [ ] Admin posts list phân trang
- [ ] Scroll to top khi chuyển trang

### Non-Functional
- [ ] Performance tốt với 100+ posts
- [ ] SEO-friendly pagination (rel prev/next)

## Implementation Steps

1. [x] **Pagination component** — Reusable `components/ui/pagination.tsx` với page numbers + ellipsis
2. [x] **Update blog listing** — 9 posts/page, auto-reset khi filter/search thay đổi
3. [x] **Update admin posts list** — 10 posts/page với count footer
4. [x] **Scroll to top** — Tự động smooth scroll khi chuyển trang
5. [ ] **SEO rel prev/next** — Deferred (client-side pagination, không cần rel links)

## Files to Create/Modify

- `[NEW] components/ui/pagination.tsx` — Reusable pagination
- `[MODIFY] lib/api/posts.ts` — Add pagination params
- `[MODIFY] components/blog-listing.tsx` — Use pagination
- `[MODIFY] components/admin-posts-list.tsx` — Use pagination
- `[MODIFY] app/page.tsx` — Accept `searchParams`

## Test Criteria

- [ ] Trang 1 hiển thị 10 posts
- [ ] Click "Next" → hiển thị 10 posts tiếp
- [ ] URL thay đổi khi chuyển trang
- [ ] Trang cuối không thể click "Next"
- [ ] Search vẫn hoạt động với pagination

---
Next Phase: [Phase 07 - RSS, Sitemap & SEO](./phase-07-rss-sitemap.md)
