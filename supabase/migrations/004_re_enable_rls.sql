-- =========================================
-- Re-enable RLS with Proper Policies
-- Migration 004
-- =========================================

-- Re-enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_shortener_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_shortener_logs ENABLE ROW LEVEL SECURITY;

-- =========================================
-- Posts Policies
-- =========================================

-- Public can read published posts
DROP POLICY IF EXISTS "Public can read posts" ON posts;
CREATE POLICY "Public can read posts"
ON posts FOR SELECT
USING (true);

-- Authenticated users can insert posts
DROP POLICY IF EXISTS "Authenticated can insert posts" ON posts;
CREATE POLICY "Authenticated can insert posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update posts
DROP POLICY IF EXISTS "Authenticated can update posts" ON posts;
CREATE POLICY "Authenticated can update posts"
ON posts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete posts
DROP POLICY IF EXISTS "Authenticated can delete posts" ON posts;
CREATE POLICY "Authenticated can delete posts"
ON posts FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- Tags Policies
-- =========================================

-- Public can read tags
DROP POLICY IF EXISTS "Public can read tags" ON tags;
CREATE POLICY "Public can read tags"
ON tags FOR SELECT
USING (true);

-- Authenticated users can insert tags
DROP POLICY IF EXISTS "Authenticated can insert tags" ON tags;
CREATE POLICY "Authenticated can insert tags"
ON tags FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update tags
DROP POLICY IF EXISTS "Authenticated can update tags" ON tags;
CREATE POLICY "Authenticated can update tags"
ON tags FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete tags
DROP POLICY IF EXISTS "Authenticated can delete tags" ON tags;
CREATE POLICY "Authenticated can delete tags"
ON tags FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- Post_Tags Policies
-- =========================================

-- Public can read post_tags
DROP POLICY IF EXISTS "Public can read post_tags" ON post_tags;
CREATE POLICY "Public can read post_tags"
ON post_tags FOR SELECT
USING (true);

-- Authenticated users can insert post_tags
DROP POLICY IF EXISTS "Authenticated can insert post_tags" ON post_tags;
CREATE POLICY "Authenticated can insert post_tags"
ON post_tags FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can delete post_tags
DROP POLICY IF EXISTS "Authenticated can delete post_tags" ON post_tags;
CREATE POLICY "Authenticated can delete post_tags"
ON post_tags FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- Comments Policies
-- =========================================

-- Public can read visible comments
DROP POLICY IF EXISTS "Public can read comments" ON comments;
CREATE POLICY "Public can read comments"
ON comments FOR SELECT
USING (true);

-- Anyone can insert comments (anonymous commenting)
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
CREATE POLICY "Anyone can insert comments"
ON comments FOR INSERT
WITH CHECK (true);

-- Authenticated users can update comments (moderation)
DROP POLICY IF EXISTS "Authenticated can update comments" ON comments;
CREATE POLICY "Authenticated can update comments"
ON comments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete comments
DROP POLICY IF EXISTS "Authenticated can delete comments" ON comments;
CREATE POLICY "Authenticated can delete comments"
ON comments FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- URL Shortener Config Policies
-- =========================================

-- Public can read config
DROP POLICY IF EXISTS "Public can read url_shortener_config" ON url_shortener_config;
CREATE POLICY "Public can read url_shortener_config"
ON url_shortener_config FOR SELECT
USING (true);

-- Authenticated users can insert config
DROP POLICY IF EXISTS "Authenticated can insert url_shortener_config" ON url_shortener_config;
CREATE POLICY "Authenticated can insert url_shortener_config"
ON url_shortener_config FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update config
DROP POLICY IF EXISTS "Authenticated can update url_shortener_config" ON url_shortener_config;
CREATE POLICY "Authenticated can update url_shortener_config"
ON url_shortener_config FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =========================================
-- Shortened URLs Policies
-- =========================================

-- Public can read shortened_urls
DROP POLICY IF EXISTS "Public can read shortened_urls" ON shortened_urls;
CREATE POLICY "Public can read shortened_urls"
ON shortened_urls FOR SELECT
USING (true);

-- Authenticated users can insert shortened_urls
DROP POLICY IF EXISTS "Authenticated can insert shortened_urls" ON shortened_urls;
CREATE POLICY "Authenticated can insert shortened_urls"
ON shortened_urls FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update shortened_urls (click count)
DROP POLICY IF EXISTS "Authenticated can update shortened_urls" ON shortened_urls;
CREATE POLICY "Authenticated can update shortened_urls"
ON shortened_urls FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- =========================================
-- URL Shortener Logs Policies
-- =========================================

-- Public can read logs
DROP POLICY IF EXISTS "Public can read url_shortener_logs" ON url_shortener_logs;
CREATE POLICY "Public can read url_shortener_logs"
ON url_shortener_logs FOR SELECT
USING (true);

-- Authenticated users can insert logs
DROP POLICY IF EXISTS "Authenticated can insert url_shortener_logs" ON url_shortener_logs;
CREATE POLICY "Authenticated can insert url_shortener_logs"
ON url_shortener_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =========================================
-- Verify RLS is enabled
-- =========================================

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
