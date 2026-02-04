# Tổng quan Dự án Blog Basic

## Mô tả Dự án
Đây là một ứng dụng Blog được xây dựng bằng **Next.js 16** (App Router) và **React 19**. Giao diện được thiết kế hiện đại sử dụng **Tailwind CSS** và các component từ **Radix UI**. Dự án hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt) và bao gồm các tính năng quản trị nội dung (CMS) cơ bản.

**Công nghệ chính:**
-   **Framework:** Next.js 16.0.3
-   **Ngôn ngữ:** TypeScript
-   **Styling:** Tailwind CSS, Tailwind Animate
-   **UI Components:** Radix UI, Lucide React (Icons)
-   **State Management:** React Context (BlogContext, LanguageContext)
-   **Form Handling:** React Hook Form, Zod
-   **Tiện ích khác:** Framer Motion (Animation), Recharts (Biểu đồ - có thể dùng cho thống kê), Date-fns

## Chức năng theo Màn hình

### 1. Trang chủ (`/`)
-   **Hiển thị bài viết:** Danh sách các bài blog mới nhất với hình ảnh, tiêu đề, tóm tắt, tác giả và ngày đăng.
-   **Tìm kiếm:** Thanh tìm kiếm cho phép lọc bài viết theo từ khóa.
-   **Đa ngôn ngữ:** Chuyển đổi ngôn ngữ giữa Tiếng Anh và Tiếng Việt.
-   **Điều hướng:** Menu điều hướng đến các trang khác (Admin, v.v.).

### 2. Chi tiết Bài viết (`/blog/[slug]`)
-   **Nội dung bài viết:** Hiển thị đầy đủ nội dung bài viết với định dạng Rich Text.
-   **Thông tin bài viết:** Hiển thị ảnh bìa, tác giả, ngày đăng và thời gian đọc.
-   **Bình luận:** Hệ thống bình luận cho phép người dùng thảo luận về bài viết (`CommentsSection`).
-   **Bài viết liên quan:** (Có thể có dựa trên cấu trúc dữ liệu).

### 3. Admin Dashboard (`/admin`)
-   **Tổng quan:** Hiển thị thống kê cơ bản (số lượng bài viết).
-   **Quản lý bài viết:**
    -   **Danh sách:** Xem danh sách tất cả bài viết.
    -   **Tạo mới:** Form tạo bài viết mới với tiêu đề, slug, tóm tắt, nội dung và ảnh bìa.
    -   **Chỉnh sửa/Xóa:** Các chức năng để cập nhật hoặc gỡ bỏ bài viết.

### 4. Cài đặt Admin (`/admin/settings`)
-   **Rút gọn URL:** Tính năng cấu hình và quản lý rút gọn URL (`URLShortenerSettings`). Cho phép tạo và quản lý các link rút gọn cho bài viết hoặc các liên kết ngoài.
