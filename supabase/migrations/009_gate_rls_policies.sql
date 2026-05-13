-- =========================================
-- Migration 009: RLS Policies for Gate System
-- Ensures the new tables (post_resources,
-- gate_steps, gate_completions) have proper
-- RLS policies matching the existing pattern.
-- Run AFTER migration 008.
-- =========================================

-- =========================================
-- RLS is disabled by default on new tables.
-- But if it's ever enabled, these policies
-- ensure everything works.
-- =========================================

-- =========================================
-- post_resources Policies
-- =========================================

-- Public can read resources
DROP POLICY IF EXISTS "Public can read post_resources" ON post_resources;
CREATE POLICY "Public can read post_resources"
ON post_resources FOR SELECT
USING (true);

-- Authenticated/admin can manage resources
DROP POLICY IF EXISTS "Authenticated can insert post_resources" ON post_resources;
CREATE POLICY "Authenticated can insert post_resources"
ON post_resources FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update post_resources" ON post_resources;
CREATE POLICY "Authenticated can update post_resources"
ON post_resources FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete post_resources" ON post_resources;
CREATE POLICY "Authenticated can delete post_resources"
ON post_resources FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- gate_steps Policies
-- =========================================

DROP POLICY IF EXISTS "Public can read gate_steps" ON gate_steps;
CREATE POLICY "Public can read gate_steps"
ON gate_steps FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated can insert gate_steps" ON gate_steps;
CREATE POLICY "Authenticated can insert gate_steps"
ON gate_steps FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update gate_steps" ON gate_steps;
CREATE POLICY "Authenticated can update gate_steps"
ON gate_steps FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete gate_steps" ON gate_steps;
CREATE POLICY "Authenticated can delete gate_steps"
ON gate_steps FOR DELETE
TO authenticated
USING (true);

-- =========================================
-- gate_completions Policies
-- =========================================

DROP POLICY IF EXISTS "Public can read gate_completions" ON gate_completions;
CREATE POLICY "Public can read gate_completions"
ON gate_completions FOR SELECT
USING (true);

-- Anyone can insert (anonymous session tracking)
DROP POLICY IF EXISTS "Anyone can insert gate_completions" ON gate_completions;
CREATE POLICY "Anyone can insert gate_completions"
ON gate_completions FOR INSERT
WITH CHECK (true);

-- =========================================
-- Verify status
-- =========================================

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('post_resources', 'gate_steps', 'gate_completions');
