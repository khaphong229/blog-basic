-- =========================================
-- RLS Policies for Admin Operations (No Auth)
-- Run this in Supabase SQL Editor
-- =========================================

-- Since we don't have authentication, we'll allow all operations
-- In production with auth, you'd restrict these to authenticated admin users

-- =========================================
-- Posts Policies
-- =========================================

-- Allow anyone to insert posts (no auth)
DROP POLICY IF EXISTS "Anyone can insert posts" ON posts;
CREATE POLICY "Anyone can insert posts"
ON posts FOR INSERT
WITH CHECK (true);

-- Allow anyone to update posts (no auth)
DROP POLICY IF EXISTS "Anyone can update posts" ON posts;
CREATE POLICY "Anyone can update posts"
ON posts FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete posts (no auth)
DROP POLICY IF EXISTS "Anyone can delete posts" ON posts;
CREATE POLICY "Anyone can delete posts"
ON posts FOR DELETE
USING (true);

-- =========================================
-- Tags Policies
-- =========================================

-- Allow anyone to insert tags
DROP POLICY IF EXISTS "Anyone can insert tags" ON tags;
CREATE POLICY "Anyone can insert tags"
ON tags FOR INSERT
WITH CHECK (true);

-- Allow anyone to update tags
DROP POLICY IF EXISTS "Anyone can update tags" ON tags;
CREATE POLICY "Anyone can update tags"
ON tags FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete tags
DROP POLICY IF EXISTS "Anyone can delete tags" ON tags;
CREATE POLICY "Anyone can delete tags"
ON tags FOR DELETE
USING (true);

-- =========================================
-- Post_Tags Policies
-- =========================================

-- Allow anyone to insert post_tags
DROP POLICY IF EXISTS "Anyone can insert post_tags" ON post_tags;
CREATE POLICY "Anyone can insert post_tags"
ON post_tags FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete post_tags
DROP POLICY IF EXISTS "Anyone can delete post_tags" ON post_tags;
CREATE POLICY "Anyone can delete post_tags"
ON post_tags FOR DELETE
USING (true);

-- =========================================
-- Comments Policies
-- =========================================

-- Allow anyone to update comments (for moderation)
DROP POLICY IF EXISTS "Anyone can update comments" ON comments;
CREATE POLICY "Anyone can update comments"
ON comments FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete comments
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;
CREATE POLICY "Anyone can delete comments"
ON comments FOR DELETE
USING (true);

-- =========================================
-- URL Shortener Config Policies
-- =========================================

-- Allow anyone to read url_shortener_config
DROP POLICY IF EXISTS "Anyone can read url_shortener_config" ON url_shortener_config;
CREATE POLICY "Anyone can read url_shortener_config"
ON url_shortener_config FOR SELECT
USING (true);

-- Allow anyone to insert url_shortener_config
DROP POLICY IF EXISTS "Anyone can insert url_shortener_config" ON url_shortener_config;
CREATE POLICY "Anyone can insert url_shortener_config"
ON url_shortener_config FOR INSERT
WITH CHECK (true);

-- Allow anyone to update url_shortener_config
DROP POLICY IF EXISTS "Anyone can update url_shortener_config" ON url_shortener_config;
CREATE POLICY "Anyone can update url_shortener_config"
ON url_shortener_config FOR UPDATE
USING (true)
WITH CHECK (true);

-- =========================================
-- Shortened URLs Policies
-- =========================================

-- Allow anyone to insert shortened_urls
DROP POLICY IF EXISTS "Anyone can insert shortened_urls" ON shortened_urls;
CREATE POLICY "Anyone can insert shortened_urls"
ON shortened_urls FOR INSERT
WITH CHECK (true);

-- Allow anyone to update shortened_urls (for click count)
DROP POLICY IF EXISTS "Anyone can update shortened_urls" ON shortened_urls;
CREATE POLICY "Anyone can update shortened_urls"
ON shortened_urls FOR UPDATE
USING (true)
WITH CHECK (true);

-- =========================================
-- URL Shortener Logs Policies
-- =========================================

-- Allow anyone to read url_shortener_logs
DROP POLICY IF EXISTS "Anyone can read url_shortener_logs" ON url_shortener_logs;
CREATE POLICY "Anyone can read url_shortener_logs"
ON url_shortener_logs FOR SELECT
USING (true);

-- Allow anyone to insert url_shortener_logs
DROP POLICY IF EXISTS "Anyone can insert url_shortener_logs" ON url_shortener_logs;
CREATE POLICY "Anyone can insert url_shortener_logs"
ON url_shortener_logs FOR INSERT
WITH CHECK (true);
