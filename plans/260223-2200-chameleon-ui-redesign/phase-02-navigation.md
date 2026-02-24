# Phase 02: Navigation Redesign
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Redesign navigation theo style Chameleon.io — clean, professional, gọn gàng hơn. Bỏ Code2 icon, dùng tên blog text-based. Giữ sticky behavior + mobile menu.

## So sánh Before → After

| Element | Hiện tại | Chameleon-style |
|---------|----------|-----------------|
| Logo | `Code2` icon + "DevBlog" | Text logo "DevBlog" với font serif, lớn hơn |
| Menu items | Chỉ có Language + Theme + Admin | Thêm "Blog" + "About" + giữ Language/Theme |
| Style | Background transparent → blur | Giữ nguyên logic, clean hơn |
| Mobile | Sidebar style | Giữ nguyên, polish UI |

## Implementation Steps
1. [ ] Redesign logo: serif font, bỏ Code2 icon
2. [ ] Thêm nav links: Blog, About (nếu có)
3. [ ] Clean code: bỏ currentTime state không dùng
4. [ ] Polish styling: thin border bottom, cleaner spacing
5. [ ] Đảm bảo mobile menu vẫn responsive

## Files to Create/Modify
- `components/navigation.tsx` — Redesign component

## Test Criteria
- [ ] Trang hiển thị đúng trên desktop và mobile
- [ ] Sticky behavior hoạt động khi scroll
- [ ] Language toggle vẫn working
- [ ] Theme toggle vẫn working
- [ ] Admin link vẫn accessible

---
Next Phase: [Phase 03 - Hero Section](./phase-03-hero.md)
