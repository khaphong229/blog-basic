import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"
import TikTokLanding from "./tiktok-landing"

/**
 * /tiktok — Landing page for TikTok viewers.
 * Enter a code from video → redirect to post.
 * Or browse recent posts via visual grid.
 */
export const metadata: Metadata = {
    title: `Tìm bài viết | ${SITE_NAME}`,
    description: "Nhập mã số từ video TikTok để tìm bài viết nhanh chóng.",
    openGraph: {
        title: `Tìm bài viết | ${SITE_NAME}`,
        description: "Nhập mã số từ video TikTok để tìm bài viết nhanh chóng.",
        url: `${SITE_URL}/tiktok`,
        siteName: SITE_NAME,
        type: "website",
    },
}

export default function TikTokPage() {
    return <TikTokLanding />
}
