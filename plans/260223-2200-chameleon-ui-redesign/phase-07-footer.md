# Phase 07: Footer Redesign
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Redesign footer thành dark theme 4-column layout như Chameleon.io. Thêm newsletter CTA lặp lại, social links, trust elements.

## So sánh Before → After

| Element | Hiện tại | Chameleon-style |
|---------|----------|-----------------|
| Background | `bg-muted/30` (light) | Dark teal/green gradient |
| Layout | 1 row: logo + social links | **4 columns**: Blog, Resources, About, Connect |
| Newsletter | Không có | Email input + Subscribe button |
| Social proof | Không có | "Join X+ readers" text |
| Copyright | Simple text | Full copyright + year |

## Layout mới

```
┌──────────────────────────────────────────────────────────────────┐
│  DARK FOOTER BACKGROUND                                          │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ BLOG    │ │ EXPLORE │ │ ABOUT    │ │ NEWSLETTER           │ │
│  │ Latest  │ │ Tags    │ │ About me │ │                      │ │
│  │ Archive │ │ Search  │ │ Contact  │ │ Join the community   │ │
│  │ TikTok  │ │ RSS     │ │ GitHub   │ │ [email     ] [Sub]  │ │
│  └─────────┘ └─────────┘ └──────────┘ └──────────────────────┘ │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│  © 2026 DevBlog · Built with Next.js        [Twitter] [GitHub]  │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Steps
1. [ ] Tạo component `Footer` riêng (hiện tại footer inline trong home-page.tsx)
2. [ ] Dark background: gradient teal → dark green
3. [ ] 4-column responsive: Blog, Explore, About, Newsletter
4. [ ] Newsletter subscribe form (reuse style từ hero)
5. [ ] Social media icons: GitHub, Twitter/X, LinkedIn
6. [ ] Copyright bar ở dưới cùng
7. [ ] Responsive: 4 col → 2 col (tablet) → 1 col (mobile)

## Files to Create/Modify
- `components/footer.tsx` — [NEW] Standalone footer component
- `components/home-page.tsx` — Replace inline footer với `<Footer />`
- `components/blog-detail-page.tsx` — Replace inline footer với `<Footer />`

## Test Criteria
- [ ] Footer hiển thị dark theme trên cả 2 pages
- [ ] 4-column layout trên desktop
- [ ] Responsive trên mobile
- [ ] Social links mở đúng URL (hoặc placeholder)
- [ ] Newsletter form UI hoạt động

---
Next Phase: [Phase 08 - Polish](./phase-08-polish.md)
