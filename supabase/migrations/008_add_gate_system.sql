-- =========================================
-- Migration 008: Add Gated Download System
-- Tables: post_resources, gate_steps, gate_completions
-- Function: increment_resource_download_count()
-- Run in Supabase SQL Editor
-- =========================================

-- =========================================
-- 1. post_resources — downloadable resources
--    attached to a blog post
-- =========================================
CREATE TABLE IF NOT EXISTS post_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('upload', 'external')),
  file_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  external_url TEXT,
  sort_order INT DEFAULT 0,
  download_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_resources_post_id ON post_resources(post_id);

-- =========================================
-- 2. gate_steps — unlock requirements per
--    resource (visit YouTube, Facebook, etc.)
-- =========================================
CREATE TABLE IF NOT EXISTS gate_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES post_resources(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gate_steps_resource_id ON gate_steps(resource_id);

-- =========================================
-- 3. gate_completions — logs user visits
--    for gate steps (anonymous session_id)
-- =========================================
CREATE TABLE IF NOT EXISTS gate_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID NOT NULL REFERENCES gate_steps(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gate_completions_step_session ON gate_completions(step_id, session_id);
CREATE INDEX IF NOT EXISTS idx_gate_completions_completed_at ON gate_completions(completed_at DESC);

-- =========================================
-- 4. Function: increment_resource_download_count
--    Atomic increment to avoid race conditions
-- =========================================
CREATE OR REPLACE FUNCTION increment_resource_download_count(res_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE post_resources
  SET download_count = download_count + 1
  WHERE id = res_id;
END;
$$;
