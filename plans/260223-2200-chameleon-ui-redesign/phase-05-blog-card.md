# Phase 05: Blog Card Enhancement
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Nâng cấp blog card theo Chameleon.io style: category badge color-coded, read time thực (tính từ content), author avatar + name + read time metadata rõ ràng hơn.

## So sánh Before → After

| Element | Hiện tại | Chameleon-style |
|---------|----------|-----------------|
| Category badge | Góc phải trên image, `bg-background/80` | Dưới image, **pill shape, color-coded** theo category |
| Read time | Hard-coded `5 min read` | Tính thực từ `post.content` (word_count / 200) |
| Meta | Date + Read time ở trên title | Date bỏ bớt hoặc để nhỏ, Read time dưới cùng |
| Author | Chỉ initial letter avatar ở footer | Avatar + Tên + Read time — line cuối card |
| Hover | `hover:shadow-lg hover:-translate-y-1` | Giữ, thêm title color change |

## Implementation Steps
1. [ ] Tính read time thực: `Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200)`
2. [ ] Di chuyển category badge: từ overlay trên image → pill dưới image
3. [ ] Color-code category badge: mapping tag name → color
4. [ ] Redesign card footer: Author avatar (circle) + Name + Read time
5. [ ] Bỏ "Read Article" hover text (không cần vì cả card là link)
6. [ ] Bỏ border-t divider trong card footer
7. [ ] Tăng image border-radius lên 16px

## Category Color Mapping
```typescript
const CATEGORY_COLORS: Record<string, string> = {
  "Growth": "text-green-700 bg-green-50 border-green-200",
  "User Onboarding": "text-blue-700 bg-blue-50 border-blue-200",
  "Product Adoption": "text-amber-700 bg-amber-50 border-amber-200",
  "News": "text-violet-700 bg-violet-50 border-violet-200",
  "Demos": "text-red-700 bg-red-50 border-red-200",
  // default fallback
}
```

## Files to Create/Modify
- `components/ui/blog-card.tsx` — Redesign card layout

## Test Criteria
- [ ] Read time hiển thị chính xác (dựa trên content length)
- [ ] Category badge hiển thị đúng color cho mỗi tag
- [ ] Author info hiển thị đúng
- [ ] Hover effect vẫn smooth
- [ ] Cards có consistent height trong grid

---
Next Phase: [Phase 06 - Article Detail](./phase-06-article-detail.md)
