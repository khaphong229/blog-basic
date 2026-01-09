# UI Improvements: Home Page Blog List

## Overview
We have completely redesigned the Blog List UI to align with the "Modern Editorial" aesthetic. The focus was on improving hierarchy, readability, and interactivity while maintaining a clean and professional look.

## Before vs After

### 1. Component Structure
-   **Before:** The card logic was inline within `BlogListing.tsx`, making it hard to maintain and style individually.
-   **After:** Created a dedicated `BlogCard` component (`components/ui/blog-card.tsx`) that encapsulates all card-specific logic and styling. This promotes reusability and cleaner code.

### 2. Grid Layout
-   **Before:** A simple `grid gap-8` which often resulted in a single column or unoptimized layout on larger screens.
-   **After:** Implemented a responsive grid:
    -   **Mobile:** 1 column (`grid-cols-1`)
    -   **Tablet:** 2 columns (`md:grid-cols-2`)
    -   **Desktop:** 3 columns (`lg:grid-cols-3`)
    -   **Alignment:** Cards stretch to equal height (`items-stretch`), ensuring a uniform row appearance.

### 3. Visual Hierarchy & Typography
-   **Before:**
    -   Title and excerpt had similar visual weight.
    -   Meta information (author, date) was clustered together without clear distinction.
-   **After:**
    -   **Date:** Placed at the top, small, uppercase, and tracking-wider for immediate context but low visual noise.
    -   **Title:** Uses `Merriweather` (Serif), bold, and `text-balance` for a strong, editorial headline feel.
    -   **Excerpt:** Uses `Geist` (Sans), with `leading-relaxed` and `text-muted-foreground` for comfortable scanning.
    -   **Tags:** Now displayed as `Badge` components with subtle backgrounds, making them distinct from the text.

### 4. Interactions & "Wow" Factors
-   **Before:** Simple border color change on hover.
-   **After:**
    -   **Lift Effect:** The card gently lifts up (`-translate-y-1`) on hover.
    -   **Shadow:** A soft, elevated shadow (`shadow-xl`) appears to create depth.
    -   **Accent Line:** A subtle gradient line fades in at the top of the card (`from-primary/40 to-secondary/40`), adding a premium touch.
    -   **Call to Action:** The "Read Article" link features an arrow that slides forward on hover.

## Technical Details
-   **New Components:** `BlogCard`, `Badge`.
-   **Tailwind v4:** Utilized new v4 features like `bg-linear-to-r` (replacing `bg-gradient-to-r`) and `grow` (replacing `flex-grow`).
-   **Radix UI:** Leveraged `Card` primitives for accessible structure.
