# Phase 04: Category Bar & Blog Listing Enhancement
Status: ⬜ Pending
Dependencies: Phase 01, Phase 03

## Objective
Tách tag filter ra khỏi search box → tạo **horizontal category navigation bar** riêng biệt, nằm giữa Hero và Blog Grid. Giống style Chameleon.io.

## So sánh Before → After

| Element | Hiện tại | Chameleon-style |
|---------|----------|-----------------|
| Tag filter | Nằm bên trong search box card | Thanh ngang riêng biệt, nổi bật |
| Search | Trong card với tags | Di chuyển lên phần phải hoặc thành riêng |
| Section header | "Latest Posts" + line | "Editor's Pick" + "Latest Posts" sections |

## Layout mới

```
┌──────────────────────────────────────────────────────────────────┐
│ Category1 | Category2 | Category3 | Category4 | ...  [🔍 Search] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Editor's Pick (optional — nếu có pinned posts)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│  │  Card 1  │ │  Card 2  │ │  Card 3  │                         │
│  └─────────┘ └─────────┘ └─────────┘                           │
│                                                                  │
│  Latest Posts                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│  │  Card 4  │ │  Card 5  │ │  Card 6  │                         │
│  └─────────┘ └─────────┘ └─────────┘                           │
│                                                                  │
│  [Pagination: 1 2 3 ... Next]                                    │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Steps
1. [ ] Tạo component `CategoryBar` riêng — horizontal scroll, text-only tags
2. [ ] Di chuyển search input vào bên phải category bar (inline)
3. [ ] Bỏ card wrapper cho search+tags hiện tại trong `blog-listing.tsx`
4. [ ] Category bar sticky dưới header khi scroll (optional)
5. [ ] Active state cho selected category (underline hoặc bold+color)
6. [ ] Thêm light background color phân biệt section (off-white cho blog grid area)

## Files to Create/Modify
- `components/category-bar.tsx` — [NEW] Horizontal category navigation
- `components/blog-listing.tsx` — Refactor: bỏ tag filter bên trong, nhận selected category từ props
- `components/home-page.tsx` — Integrate CategoryBar giữa hero và blog listing

## Test Criteria
- [ ] Category bar hiển thị tất cả tags theo chiều ngang
- [ ] Click vào category → filter posts đúng
- [ ] Search vẫn hoạt động song song với category filter
- [ ] Mobile: category bar scroll horizontal
- [ ] Reset filter hoạt động

---
Next Phase: [Phase 05 - Blog Card](./phase-05-blog-card.md)
