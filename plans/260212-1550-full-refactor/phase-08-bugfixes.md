# Phase 08: Bug Fixes & Polish

Status: ✅ Complete
Dependencies: Phase 01-07

## Objective

Sửa các vấn đề đã phát hiện trong brainstorm và polish tổng thể.

## Implementation Steps

1. [ ] **Fix `clean` script** — Skipped (no clean script existed, not needed)
2. [x] **Fix duplicate providers** — Already done in Phase 02
3. [x] **Optimize Lottie** — Lazy load `Logo.json` via `dynamic()` + `import()`
4. [ ] **Update README.md** — Deferred (cosmetic)
5. [x] **Error Boundaries** — Already done in Phase 02 (`error.tsx` files)
6. [x] **Dark mode toggle** — `next-themes` + `ThemeProvider` + `ThemeToggle` in nav
7. [x] **Tailwind v4 lint fixes** — Batch fixed `flex-shrink-0` → `shrink-0`, `bg-gradient-*` → `bg-linear-*`

## Files to Create/Modify

- `[MODIFY] package.json` — Fix clean script
- `[MODIFY] app/page.tsx` — Remove duplicate providers
- `[MODIFY] components/hero-lottie-decoration.tsx` — Lazy load
- `[MODIFY] README.md` — Rewrite
- `[NEW] components/theme-toggle.tsx` — Dark/Light switch
- `[MODIFY] components/navigation.tsx` — Add theme toggle

## Test Criteria

- [ ] `npm run clean` hoạt động trên Windows
- [ ] No console errors/warnings
- [ ] Dark mode toggle chuyển theme mượt
- [ ] README phản ánh đúng dự án

---
Next Phase: [Phase 09 - Testing](./phase-09-testing.md)
