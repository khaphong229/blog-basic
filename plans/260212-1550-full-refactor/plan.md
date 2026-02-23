# Plan: Full Refactor — Blog Basic → Production-Ready

Created: 2026-02-12 15:50
Status: 🟡 In Progress

## Overview

Tái cấu trúc toàn diện blog-basic từ prototype → production-ready. Bao gồm: Server Components, Supabase Auth + RLS, i18n chuẩn, tối ưu performance, image upload, RSS/Sitemap.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Server Components + Client Components)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Styling:** Tailwind CSS v4 (giữ nguyên)
- **i18n:** File-based translations (thay thế hardcoded context)
- **Testing:** Vitest + Testing Library (đã cấu hình)

## Phases

| Phase | Name | Status | Tasks | Ước tính |
|-------|------|--------|-------|----------|
| 01 | Auth & Security | 🟡 Code Done | 8 | 1 session |
| 02 | Server Components & Performance | 🟡 Code Done | 10 | 2 sessions |
| 03 | i18n Refactor | ✅ Complete | 6 | 1 session |
| 04 | BlogContext Decomposition | ✅ Complete | 7 | 1 session |
| 05 | Image Upload & Storage | 🟡 Code Done | 5 | 1 session |
| 06 | Pagination & UX | ✅ Complete | 5 | 1 session |
| 07 | RSS, Sitemap & SEO | ✅ Complete | 5 | 1 session |
| 08 | Bug Fixes & Polish | ✅ Complete | 6 | 1 session |
| 09 | Testing | ✅ Complete | 6 | 1 session |

**Tổng:** ~58 tasks | Ước tính: 10 sessions

## Quick Commands

- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
