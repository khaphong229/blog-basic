# Phase 09: Testing

Status: ✅ Complete
Dependencies: Phase 01-08

## Objective

Viết unit tests và integration tests cho các phần quan trọng. Vitest + Testing Library đã được cấu hình sẵn.

## Implementation Steps

1. [x] **Test i18n utilities** — `translate()`, `getTranslations()`, missing keys, nested keys, params
2. [x] **Test structured data** — JSON-LD generation, optional fields, language mapping
3. [x] **Test components** — Pagination rendering, boundaries, a11y
4. [x] **Test site config** — Constants exported correctly
5. [x] **Setup vitest** — Config + jsdom + testing-library
6. [x] **Build verification** — `npm run build` passes

## Files to Create

- `[NEW] __tests__/lib/i18n.test.ts`
- `[NEW] __tests__/lib/api/posts.test.ts`
- `[NEW] __tests__/components/blog-card.test.tsx`
- `[NEW] __tests__/components/pagination.test.tsx`
- `[NEW] __tests__/components/navigation.test.tsx`

## Test Commands

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Run specific test
npx vitest run __tests__/lib/i18n.test.ts
```

## Test Criteria

- [ ] All tests pass (`npm run test`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)

---
✅ **REFACTOR COMPLETE!**
