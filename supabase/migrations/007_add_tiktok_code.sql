-- =========================================
-- Migration 007: Add tiktok_code to posts
-- Shared between VI and EN linked posts
-- Run in Supabase SQL Editor
-- =========================================

-- Sequence starts at 101 (3-digit, easy to read on video)
CREATE SEQUENCE IF NOT EXISTS tiktok_code_seq START 101;

-- Add column (NOT unique — VI and EN linked posts share the same code)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tiktok_code integer DEFAULT nextval('tiktok_code_seq');

-- Index for fast lookup by tiktok_code
CREATE INDEX IF NOT EXISTS idx_posts_tiktok_code ON posts(tiktok_code);
