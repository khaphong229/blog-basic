# Full Refactor Specification — blog-basic

## Executive Summary

Tái cấu trúc toàn diện blog-basic từ prototype → production-ready app. Giải quyết các vấn đề: không có auth, BlogContext quá lớn (716 LOC), toàn bộ "use client", N+1 queries, i18n hardcoded, không có tests.

## Target Architecture

```
app/
├── (public)/           # Server Components — SSR/SSG
│   ├── page.tsx        # Homepage (ISR)
│   └── blog/[slug]/    # Blog detail (SSR + generateMetadata)
├── admin/              # Client Components — protected by middleware
│   ├── login/          # Auth page
│   ├── page.tsx        # Dashboard
│   └── settings/       # URL shortener config
├── api/
│   ├── translate/      # Gemini AI translation
│   └── upload/         # Image upload (NEW)
├── feed.xml/           # RSS feed (NEW)
├── sitemap.ts          # Auto sitemap (NEW)
├── robots.ts           # Robots.txt (NEW)
└── middleware.ts       # Auth route protection (NEW)

context/
├── posts-context.tsx       # Posts only (was BlogContext)
├── comments-context.tsx    # Comments only
├── url-shortener-context.tsx  # URL shortener only
└── language-context.tsx    # i18n (refactored)

messages/
├── en.json  # English translations (NEW)
└── vi.json  # Vietnamese translations (NEW)
```

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth | Supabase Auth (email/pw) | Already using Supabase, no extra dependency |
| i18n | File-based JSON + custom hook | Simpler than next-intl, fits current pattern |
| Image storage | Supabase Storage | Same ecosystem, CDN included |
| Pagination | URL-based server-side | SEO-friendly, works with SSR |
| RSS | Route Handler | Next.js native, auto-updates |

## Phases

See `plans/260212-1550-full-refactor/` for detailed phase breakdown.
