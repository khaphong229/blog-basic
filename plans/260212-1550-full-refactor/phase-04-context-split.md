# Phase 04: BlogContext Decomposition

Status: ✅ Complete
Dependencies: Phase 02, Phase 03

## Objective

Tách `BlogContext` (716 dòng, chứa tất cả) thành các contexts nhỏ, focused. Mỗi context chịu trách nhiệm 1 domain. Giảm re-renders không cần thiết.

## Requirements

### Functional
- [ ] Posts management → `PostsContext` (hoặc hooks)
- [ ] Comments management → riêng biệt
- [ ] URL Shortener → `UrlShortenerContext` (chỉ dùng trong admin)
- [ ] Tất cả chức năng hiện tại vẫn hoạt động

### Non-Functional
- [ ] Không gây re-render toàn bộ app khi chỉ update comments
- [ ] Dễ test từng context riêng lẻ
- [ ] Code dễ đọc, dễ maintain

## Implementation Steps

1. [x] **Tách PostsContext** — CRUD posts, search, filter by language/tag
2. [x] **Tách CommentsContext** — addComment được giữ trong PostsContext (refresh posts sau add)
3. [x] **Tách UrlShortenerContext** — Config + logs (riêng biệt)
4. [x] **Chuyển sang custom hooks** — `usePosts()`, `useUrlShortener()`
5. [x] **Migrate components** — Backward-compatible facade giữ `useBlog()` hoạt động
6. [x] **Xóa BlogContext cũ** — Đã refactor thành facade (re-exports)
7. [x] **Tối ưu provider tree** — PostsProvider + UrlShortenerProvider composed

## Files to Create/Modify

- `[NEW] context/posts-context.tsx` — Posts state management
- `[NEW] context/comments-context.tsx` — Comments state management
- `[NEW] context/url-shortener-context.tsx` — URL shortener state
- `[MODIFY] app/layout.tsx` — Chỉ wrap PostsContext (global)
- `[MODIFY] components/blog-detail-page.tsx` — Wrap CommentsContext
- `[MODIFY] app/admin/settings/page.tsx` — Wrap UrlShortenerContext
- `[DELETE] context/blog-context.tsx` — Sau khi migrate xong

## Test Criteria

- [ ] Blog listing hiển thị đúng posts
- [ ] Blog detail hiển thị comments
- [ ] Admin CRUD posts hoạt động
- [ ] Admin manage comments hoạt động
- [ ] URL shortener settings hoạt động
- [ ] Search posts hoạt động
- [ ] Filter by tag hoạt động

---
Next Phase: [Phase 05 - Image Upload](./phase-05-image-upload.md)
