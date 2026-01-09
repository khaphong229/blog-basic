# Blog Basic – UI Context

## Project Overview
A modern Blog application built with Next.js App Router and React 19.
Focus on content-first reading experience with clean, modern UI.

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS, Tailwind Animate
- UI Components: Radix UI, Lucide React
- Animation: Framer Motion
- Charts: Recharts
- Forms: React Hook Form + Zod
- State: React Context
- Date utils: date-fns

## Supported Languages
- English
- Vietnamese

## Target Users
- Readers (consume long-form content)
- Writers / Admins (manage content)

## Screens & UI Notes

### Home Page (/)
- Blog list with cover image, title, excerpt, author, published date
- Search input for filtering posts
- Language switcher (EN / VI)
- Navigation header

### Blog Detail (/blog/[slug])
- Rich text content (long-form reading)
- Cover image, author, published date, reading time
- Comments section
- Related posts (optional)

### Admin Dashboard (/admin)
- Overview statistics (post count)
- Blog post management (list, create, edit, delete)
- Form-heavy UI

### Admin Settings (/admin/settings)
- URL Shortener management
- Table + form based UI

## Current UI Problems
- Typography hierarchy is weak
- Layout feels narrow and flat
- Blog cards look generic
- Reading experience not optimized
- Admin UI lacks visual structure

## Design Direction
- Modern editorial blog
- Content-first reading experience
- Clean, calm, professional
- Subtle motion (not flashy)
- Clear hierarchy and spacing

## Constraints
- Do NOT change routing
- Do NOT change business logic
- Do NOT change data structure
- UI / UX improvement only
