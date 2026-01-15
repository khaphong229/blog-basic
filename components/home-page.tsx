"use client";

import { useLanguage } from "@/context/language-context";
import { useState } from "react";
import BlogListing from "./blog-listing";
import Navigation from "./navigation";
import AnimatedGradientBackdrop from "./animated-gradient-backdrop";
import HeroLottieDecoration from "./hero-lottie-decoration";
import { motion } from "framer-motion";

export default function HomePage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Layer 1: Animated gradient blobs (z-0) */}
      <AnimatedGradientBackdrop />
      
      {/* Layer 2: Dot pattern overlay (z-0) */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

      <Navigation />

      <main className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section - relative container for Lottie positioning */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16 text-center"
          >
            <h1 className="text-6xl font-extrabold mb-6 text-pretty tracking-tight font-serif">
              {language === "en"
                ? "Welcome to Our Blog"
                : "Chào mừng đến Blog của chúng tôi"}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              {language === "en"
                ? "Discover insightful articles and stories from our expert writers."
                : "Khám phá các bài viết và câu chuyện sâu sắc từ các chuyên gia của chúng tôi."}
            </p>
          </motion.div>

          {/* Decorative Lottie - right side, hidden on mobile */}
          <HeroLottieDecoration />
        </div>

        <BlogListing
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>
    </div>
  );
}
