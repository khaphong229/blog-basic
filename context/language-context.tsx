"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "vi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
    "home.title": "Welcome to Our Blog",
    "home.subtitle": "Discover insightful articles and stories",
    "home.language": "Language",
    "home.selectLanguage": "Select Language",
    "blog.allPosts": "All Posts",
    "blog.noResults": "No posts found",
    "blog.readMore": "Read More",
    "blog.by": "By",
    "blog.on": "on",
    "blog.comments": "Comments",
    "blog.leaveComment": "Leave a Comment",
    "blog.yourName": "Your Name",
    "blog.yourEmail": "Your Email",
    "blog.comment": "Comment",
    "blog.submit": "Submit",
    "blog.search": "Search posts...",
    "admin.dashboard": "Admin Dashboard",
    "admin.newPost": "New Post",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.title": "Title",
    "admin.content": "Content",
    "admin.save": "Save",
    "admin.cancel": "Cancel",
    "admin.logout": "Logout",
  },
  vi: {
    "nav.home": "Trang chủ",
    "nav.about": "Về chúng tôi",
    "nav.contact": "Liên hệ",
    "home.title": "Chào mừng đến Blog của chúng tôi",
    "home.subtitle": "Khám phá các bài viết và câu chuyện sâu sắc",
    "home.language": "Ngôn ngữ",
    "home.selectLanguage": "Chọn Ngôn ngữ",
    "blog.allPosts": "Tất cả Bài viết",
    "blog.noResults": "Không tìm thấy bài viết",
    "blog.readMore": "Đọc thêm",
    "blog.by": "Bởi",
    "blog.on": "vào",
    "blog.comments": "Bình luận",
    "blog.leaveComment": "Để lại bình luận",
    "blog.yourName": "Tên của bạn",
    "blog.yourEmail": "Email của bạn",
    "blog.comment": "Bình luận",
    "blog.submit": "Gửi",
    "blog.search": "Tìm kiếm bài viết...",
    "admin.dashboard": "Bảng điều khiển",
    "admin.newPost": "Bài viết Mới",
    "admin.edit": "Chỉnh sửa",
    "admin.delete": "Xóa",
    "admin.title": "Tiêu đề",
    "admin.content": "Nội dung",
    "admin.save": "Lưu",
    "admin.cancel": "Hủy",
    "admin.logout": "Đăng xuất",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
