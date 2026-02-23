# Phase 01: Authentication & Security

Status: 🟡 Code Complete (Manual steps remain: Run RLS migration + Create admin user)
Dependencies: None (First phase)

## Objective

Thêm Supabase Auth cho admin panel và thiết lập RLS policies đúng chuẩn. Hiện tại RLS đã bị disable (migration 003), cần re-enable với policies phù hợp.

## Requirements

### Functional
- [ ] Admin phải đăng nhập (email/password) trước khi truy cập `/admin`
- [ ] Public users vẫn đọc blog bình thường (không cần auth)
- [ ] Comments vẫn cho phép anonymous (nhập name + email)
- [ ] Admin có thể quản lý bài viết, comments, URL shortener settings

### Non-Functional
- [ ] RLS policies bảo vệ write operations
- [ ] Service role key chỉ dùng server-side
- [ ] Session persistence (auto refresh token)

## Implementation Steps

1. [ ] **Setup Supabase Auth** — Enable Email/Password provider trong Supabase Dashboard
2. [ ] **Tạo admin user** — Seed script hoặc manual tạo user admin
3. [ ] **Tạo middleware auth** — `middleware.ts` protect routes `/admin/*`
4. [ ] **Tạo Login page** — `app/admin/login/page.tsx` với form đăng nhập
5. [ ] **Cập nhật Supabase client** — Tạo server-side + client-side helpers dùng `@supabase/ssr`
6. [ ] **Re-enable RLS** — Migration `004_re_enable_rls.sql` với policies đúng:
   - `SELECT` on `posts`, `tags`, `comments`: cho tất cả (public read)
   - `INSERT/UPDATE/DELETE` on `posts`, `tags`, `post_tags`: chỉ authenticated admin
   - `INSERT` on `comments`: cho tất cả (public comment)
   - `UPDATE/DELETE` on `comments`: chỉ admin
   - `url_shortener_*`: chỉ admin
7. [ ] **Update Supabase admin client** — Dùng service role cho admin operations
8. [ ] **Logout button** — Thêm nút logout vào admin navigation

## Files to Create/Modify

- `[NEW] middleware.ts` — Route protection
- `[NEW] app/admin/login/page.tsx` — Login page
- `[NEW] lib/supabase/server.ts` — Server-side Supabase client (cookies)
- `[NEW] lib/supabase/middleware.ts` — Middleware helper
- `[NEW] supabase/migrations/004_re_enable_rls.sql` — RLS policies
- `[MODIFY] lib/supabase/client.ts` — Update client config
- `[MODIFY] lib/supabase/admin.ts` — Ensure service role usage
- `[MODIFY] components/admin-dashboard.tsx` — Add logout button
- `[MODIFY] package.json` — Add `@supabase/ssr` dependency

## Test Criteria

- [ ] Truy cập `/admin` khi chưa login → redirect về `/admin/login`
- [ ] Login thành công → redirect về `/admin`
- [ ] Logout → redirect về `/admin/login`
- [ ] Public user đọc blog bình thường
- [ ] Public user gửi comment được
- [ ] Unauthenticated API call đến admin operations → bị reject

---
Next Phase: [Phase 02 - Server Components & Performance](./phase-02-server-components.md)
