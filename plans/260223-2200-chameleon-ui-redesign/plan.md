# Plan: Chameleon.io Blog UI Redesign

> **Lấy cảm hứng từ [chameleon.io/blog](https://www.chameleon.io/blog/)** — áp dụng system design, UI/UX patterns vào `blog-basic`

Created: 2026-02-23 22:00
Status: ✅ Done

## Overview

Redesign toàn bộ giao diện blog theo phong cách **SaaS Blog chuyên nghiệp** của Chameleon.io:
- **Hero Section** mới với Newsletter + Featured Post
- **Category Navigation Bar** ngang
- **Blog Card** nâng cấp (read time thực, category badge color-coded)
- **Article Detail** với Sticky TOC + Reading Progress Bar
- **Footer** dark theme 4-column layout
- **Color System** refresh (green accent thay indigo)

## Tech Stack (giữ nguyên)
- Frontend: Next.js 16 + React 19 + TailwindCSS 4
- Backend: Supabase
- Animation: Framer Motion
- Font: Inter (giữ nguyên) + Thêm Serif font cho editorial feel

## Phases

| Phase | Name | Status | Files Changed |
|-------|------|--------|---------------|
| 01 | Design System & Color Palette | ✅ Complete | `globals.css`, `layout.tsx` |
| 02 | Navigation Redesign | ✅ Complete | `navigation.tsx` |
| 03 | Hero Section & Featured Post | ✅ Complete | `home-page.tsx` |
| 04 | Category Bar & Blog Listing | ✅ Complete | `blog-listing.tsx` |
| 05 | Blog Card Enhancement | ✅ Complete | `ui/blog-card.tsx` |
| 06 | Article Detail + Sticky TOC | ✅ Complete | `blog-post-detail.tsx`, `blog-detail-page.tsx` |
| 07 | Footer Redesign | ✅ Complete | `home-page.tsx`, `blog-detail-page.tsx` |
| 08 | Polish & Verification | ✅ Complete | Multiple files |

**Tổng:** ~8 phases | Ước tính: 3-4 sessions

## Reference
- Phân tích Chameleon.io: `brain/chameleon_blog_analysis.md`

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
