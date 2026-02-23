# Phase 03: i18n Refactor

Status: ✅ Complete
Dependencies: Phase 02 (Server Components)

## Objective

Chuyển i18n từ hardcoded translations trong `language-context.tsx` sang file-based system. Hỗ trợ mở rộng thêm ngôn ngữ dễ dàng. Tương thích với cả Server và Client Components.

## Requirements

### Functional
- [ ] Translations nằm trong file JSON riêng (`messages/en.json`, `messages/vi.json`)
- [ ] Server Components có thể dùng translations
- [ ] Client Components vẫn dùng `useLanguage()` hook
- [ ] Language switching vẫn hoạt động realtime (không reload page)

### Non-Functional
- [ ] Dễ thêm ngôn ngữ mới (chỉ cần tạo file JSON)
- [ ] Type-safe translation keys
- [ ] Bundle size giảm (không load cả 2 ngôn ngữ)

## Implementation Steps

1. [x] **Tạo translation files** — `messages/en.json`, `messages/vi.json` từ data hiện có
2. [x] **Tạo i18n utility** — `lib/i18n.ts` với `getTranslations(lang)` + `translate()` function
3. [x] **Refactor `LanguageContext`** — Load translations từ files thay vì hardcode
4. [x] **Cập nhật Server Components** — Dùng `getTranslations()` trực tiếp
5. [x] **Cập nhật Client Components** — Giữ `useLanguage()` hook, data từ files (backward compatible)
6. [x] **Group translation keys** — Tổ chức theo namespace (`nav.*`, `blog.*`, `admin.*`, `comment.*`, `error.*`)

## Files to Create/Modify

- `[NEW] messages/en.json` — English translations
- `[NEW] messages/vi.json` — Vietnamese translations
- `[NEW] lib/i18n.ts` — i18n utility functions
- `[MODIFY] context/language-context.tsx` — Load from files
- `[MODIFY] components/navigation.tsx` — Use new i18n
- `[MODIFY] components/home-page.tsx` — Replace inline translations

## Test Criteria

- [ ] Chuyển ngôn ngữ EN ↔ VI hoạt động mượt
- [ ] Tất cả text hiển thị đúng ngôn ngữ
- [ ] Server-rendered pages có text đúng ngôn ngữ
- [ ] Không có translation key nào bị thiếu (hiện raw key)

---
Next Phase: [Phase 04 - BlogContext Decomposition](./phase-04-context-split.md)
