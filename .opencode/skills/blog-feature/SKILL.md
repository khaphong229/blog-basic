---
name: blog-feature
description: Guidelines for working with the Blog feature (posts, listing, details)
---

# Blog Feature Guidelines

## 1. Directory Structure
- `app/blog/page.tsx`: Listing page
- `app/blog/[slug]/page.tsx`: Detail page
- `components/blog-*.tsx`: Blog-specific components

## 2. Data Flow
- Blog posts are managed via `BlogContext`.
- Use `useBlog()` hook to access posts.

## 3. Component Naming
- Listing: `BlogListing`
- Card: `BlogCard`
- Detail: `BlogPostDetail`
