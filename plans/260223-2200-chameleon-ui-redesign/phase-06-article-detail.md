# Phase 06: Article Detail + Sticky TOC + Reading Progress
Status: ⬜ Pending
Dependencies: Phase 01, Phase 05

## Objective
Nâng cấp trang chi tiết bài viết theo Chameleon.io:
- **Sticky sidebar** bên trái với Table of Contents
- **Reading progress bar** ở top
- Clean typography, tối ưu readability

## Layout mới

```
┌──────────────────────────────────────────────────────────────────┐
│  [████████████░░░░░░░░░░░░░] 35% Reading Progress               │
├──────────────────────────────────────────────────────────────────┤
│  Navigation                                                      │
├───────────────┬──────────────────────────────────────────────────┤
│               │                                                  │
│  ← Back       │   [Tags]                                        │
│               │   Title (large, bold)                            │
│  Article Title│   Author · Date · Read Time                     │
│  ───────────  │                                                  │
│  25% complete │   [Featured Image]                               │
│               │                                                  │
│  • Section 1  │   ## Section 1                                   │
│  • Section 2  │   Content paragraphs...                         │
│  • Section 3  │                                                  │
│               │   ## Section 2                                   │
│               │   Content paragraphs...                         │
│               │                                                  │
│               │   ─── Share ───                                  │
│               │   [Copy] [Twitter] [Facebook]                   │
└───────────────┴──────────────────────────────────────────────────┘
```

## Implementation Steps
1. [ ] Tạo `ReadingProgress` component — progress bar fixed ở top
2. [ ] Tạo `TableOfContents` component — parse headings từ HTML content
3. [ ] Refactor `blog-post-detail.tsx`: 2-column layout (sidebar 25% + content 75%)
4. [ ] Sidebar sticky: hiển thị article title + progress + TOC
5. [ ] TOC clickable: smooth scroll đến heading tương ứng
6. [ ] Active state cho TOC item đang đọc (intersection observer)
7. [ ] Mobile: ẩn sidebar, chỉ giữ reading progress bar
8. [ ] Bỏ terminal-style elements còn sót (error page, footer icons)

## Components mới

### ReadingProgress
```tsx
// Fixed bar ở top page, width = scroll percentage
// Color: primary (green)
```

### TableOfContents
```tsx
// Parse post.content HTML → extract h2, h3
// Render as clickable list
// Highlight active section using IntersectionObserver
```

## Files to Create/Modify
- `components/reading-progress.tsx` — [NEW] Progress bar component
- `components/table-of-contents.tsx` — [NEW] TOC sidebar component
- `components/blog-post-detail.tsx` — Refactor to 2-column with sidebar
- `components/blog-detail-page.tsx` — Update layout wrapper

## Test Criteria
- [ ] Progress bar hiển thị và animate khi scroll
- [ ] TOC liệt kê đúng tất cả headings từ article
- [ ] Click TOC item → smooth scroll đến heading
- [ ] Active TOC item highlight khi scroll qua section
- [ ] Mobile: sidebar hidden, progress bar visible
- [ ] Back to blog link hoạt động

---
Next Phase: [Phase 07 - Footer](./phase-07-footer.md)
