# Phase 05: Image Upload & Storage

Status: 🟡 Code Complete (Manual step: Create blog-images bucket + Run migration 006)
Dependencies: Phase 01 (Auth for RLS on storage)

## Objective

Thêm khả năng upload featured image cho bài viết sử dụng Supabase Storage. Hiện tại `featured_image` field chỉ lưu URL text.

## Requirements

### Functional
- [ ] Admin upload ảnh khi tạo/sửa bài viết
- [ ] Preview ảnh trước khi upload
- [ ] Ảnh được tối ưu (resize, compress)
- [ ] Hiển thị ảnh trong blog listing và detail

### Non-Functional
- [ ] Max file size: 5MB
- [ ] Chấp nhận: JPEG, PNG, WebP
- [ ] Ảnh được serve qua Supabase CDN

## Implementation Steps

1. [x] **Tạo Storage bucket** — `blog-images` bucket docs + RLS migration 006
2. [x] **Tạo upload API** — `app/api/upload/route.ts` (auth, validation, S3 upload)
3. [x] **Tạo ImageUpload component** — Drag & drop + preview + replace/remove
4. [x] **Tích hợp vào PostForm** — Replace text input bằng ImageUpload
5. [ ] **Optimize images** — Next.js `<Image>` component (deferred: requires next.config remotePatterns)

## Files to Create/Modify

- `[NEW] app/api/upload/route.ts` — Upload endpoint
- `[NEW] components/image-upload.tsx` — Upload component
- `[MODIFY] components/admin-post-form.tsx` — Use ImageUpload
- `[MODIFY] components/ui/blog-card.tsx` — Use `<Image>` component
- `[MODIFY] components/blog-post-detail.tsx` — Use `<Image>` component

## Test Criteria

- [ ] Upload ảnh thành công → hiển thị trong form
- [ ] Ảnh hiển thị trên blog listing
- [ ] Ảnh hiển thị trên blog detail
- [ ] Upload file > 5MB → báo lỗi
- [ ] Upload file không phải ảnh → báo lỗi

---
Next Phase: [Phase 06 - Pagination & UX](./phase-06-pagination.md)
