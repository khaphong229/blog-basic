# Phase 01: Design System & Color Palette
Status: ✅ Complete
Dependencies: None

## Objective
Cập nhật Design System từ **indigo-based** sang **green-based** (lấy cảm hứng từ Chameleon.io). Thêm serif font cho editorial headings. Tạo CSS variables mới cho category colors, footer dark theme.

## So sánh Before → After

| Token | Hiện tại (Indigo) | Mới (Green/Teal) |
|-------|-------------------|-------------------|
| `--primary` | `#4f46e5` (indigo-600) | `#16a34a` (green-600) |
| `--primary` dark | `#6366f1` (indigo-500) | `#22c55e` (green-500) |
| `--ring` | `#4f46e5` | `#16a34a` |
| `--chart-1` | `#4f46e5` | `#16a34a` |

## CSS Variables mới cần thêm

```css
/* Category badge colors */
--category-growth: #22c55e;
--category-onboarding: #3b82f6;
--category-adoption: #f59e0b;
--category-news: #8b5cf6;
--category-demos: #ef4444;

/* Footer dark theme */
--footer-bg: #0f2b2b;
--footer-text: #94a3b8;
--footer-heading: #e2e8f0;

/* Editorial */
--font-serif: "Playfair Display", Georgia, serif;
```

## Implementation Steps
1. [ ] Cập nhật `:root` CSS variables trong `globals.css` — đổi primary từ indigo → green
2. [ ] Cập nhật `.dark` CSS variables tương ứng
3. [ ] Thêm `--font-serif` vào `@theme inline`
4. [ ] Thêm category color variables
5. [ ] Thêm footer dark theme variables
6. [ ] Import Playfair Display font trong `layout.tsx`
7. [ ] Verify: check tất cả components sử dụng `primary` color vẫn hoạt động đúng

## Files to Create/Modify
- `app/globals.css` — Cập nhật tất cả color tokens
- `app/layout.tsx` — Thêm Playfair Display font import

## Test Criteria
- [ ] `npm run build` thành công, không có lỗi
- [ ] Dev server chạy được, trang hiển thị đúng với màu mới
- [ ] Dark mode vẫn hoạt động bình thường
- [ ] Không có component nào bị broken

---
Next Phase: [Phase 02 - Navigation Redesign](./phase-02-navigation.md)
