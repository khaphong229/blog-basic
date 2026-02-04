-- =========================================
-- FIX: Disable RLS for No-Auth Blog
-- Run this in Supabase SQL Editor
-- =========================================

-- Option 1: DISABLE RLS completely (simplest for no-auth)
-- This allows all operations without policy checks

ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE shortened_urls DISABLE ROW LEVEL SECURITY;
ALTER TABLE url_shortener_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE url_shortener_logs DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
