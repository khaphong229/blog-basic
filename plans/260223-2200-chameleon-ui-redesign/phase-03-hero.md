# Phase 03: Hero Section & Featured Post
Status: ⬜ Pending
Dependencies: Phase 01, Phase 02

## Objective
Redesign Hero Section theo style Chameleon.io:
- **Trái (60%)**: Blog title (serif!) + tagline + Newsletter subscribe form
- **Phải (40%)**: Featured post card lớn
- Bỏ Stats Section hiện tại (Articles/Topics/Updates — ít giá trị)

## Layout mới

```
┌─────────────────────────────────────────────────────────────────┐
│  Navigation                                                      │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│  "The DevBlog"  (serif)    │   [Featured Post Card]            │
│                            │   ┌──────────────────────┐        │
│  Your hub for thoughts,    │   │  Featured Image      │        │
│  stories & ideas.          │   │                      │        │
│                            │   ├──────────────────────┤        │
│  ┌─────────────────┬────┐  │   │  Title               │        │
│  │ Enter email      │Sub│  │   │  Excerpt...          │        │
│  └─────────────────┴────┘  │   └──────────────────────┘        │
│                            │                                    │
├────────────────────────────┴────────────────────────────────────┤
│  [Category Bar]                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Implementation Steps
1. [ ] Redesign hero layout: 2-column (60/40) responsive
2. [ ] Blog title dùng serif font (Playfair Display)
3. [ ] Thêm newsletter subscribe form (email input + button)
4. [ ] Thêm Featured Post card bên phải (bài mới nhất hoặc pinned)
5. [ ] Bỏ Stats section (Articles/Topics/Updates cards)
6. [ ] Bỏ AnimatedGradientBackdrop nếu không hợp style mới
7. [ ] Mobile: stack vertical (title → subscribe → featured post)

## Newsletter Form
- Email input + Subscribe button
- Text nhỏ: "We use your email to send you new blog posts."
- **Hiện tại chưa cần backend** — chỉ UI, onclick show toast "Coming soon"

## Files to Create/Modify
- `components/home-page.tsx` — Redesign hero + bỏ stats

## Test Criteria
- [ ] Hero hiển thị 2-column trên desktop, 1-column trên mobile
- [ ] Featured post card hiển thị bài viết mới nhất
- [ ] Newsletter form UI hoạt động (input + button visible)
- [ ] Không còn Stats section

---
Next Phase: [Phase 04 - Category Bar](./phase-04-category-bar.md)
