# Translation Keys Reference

Quick reference for all translation keys in the project.

## File Location
`context/language-context.tsx`

## Available Languages
- `en` - English
- `vi` - Vietnamese (Tiếng Việt)

## Current Translation Keys

### Navigation
| Key | English | Vietnamese |
|-----|---------|------------|
| `nav.home` | Home | Trang chủ |
| `nav.about` | About | Về chúng tôi |
| `nav.contact` | Contact | Liên hệ |

### Home Page
| Key | English | Vietnamese |
|-----|---------|------------|
| `home.title` | Welcome to Our Blog | Chào mừng đến Blog của chúng tôi |
| `home.subtitle` | Discover insightful articles and stories | Khám phá các bài viết và câu chuyện sâu sắc |
| `home.language` | Language | Ngôn ngữ |
| `home.selectLanguage` | Select Language | Chọn Ngôn ngữ |

### Blog
| Key | English | Vietnamese |
|-----|---------|------------|
| `blog.allPosts` | All Posts | Tất cả Bài viết |
| `blog.noResults` | No posts found | Không tìm thấy bài viết |
| `blog.readMore` | Read More | Đọc thêm |
| `blog.by` | By | Bởi |
| `blog.on` | on | vào |
| `blog.comments` | Comments | Bình luận |
| `blog.leaveComment` | Leave a Comment | Để lại bình luận |
| `blog.yourName` | Your Name | Tên của bạn |
| `blog.yourEmail` | Your Email | Email của bạn |
| `blog.comment` | Comment | Bình luận |
| `blog.submit` | Submit | Gửi |
| `blog.search` | Search posts... | Tìm kiếm bài viết... |

### Admin
| Key | English | Vietnamese |
|-----|---------|------------|
| `admin.dashboard` | Admin Dashboard | Bảng điều khiển |
| `admin.newPost` | New Post | Bài viết Mới |
| `admin.edit` | Edit | Chỉnh sửa |
| `admin.delete` | Delete | Xóa |
| `admin.title` | Title | Tiêu đề |
| `admin.content` | Content | Nội dung |
| `admin.save` | Save | Lưu |
| `admin.cancel` | Cancel | Hủy |
| `admin.logout` | Logout | Đăng xuất |

## Usage

```typescript
import { useLanguage } from "@/context/language-context"

function MyComponent() {
  const { language, t } = useLanguage()
  
  return (
    <div>
      <h1>{t("home.title")}</h1>
      <p>{t("blog.readMore")}</p>
    </div>
  )
}
```

## Adding New Keys

1. Open `context/language-context.tsx`
2. Add key to `translations.en` object
3. Add key to `translations.vi` object
4. Use `t("your.key")` in components
