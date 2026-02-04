-- Migration: Add linked_post_id to posts table
-- Description: Adds a self-referencing foreign key to link translated posts
-- Author: Antigravity

-- Add the column
ALTER TABLE "public"."posts" 
ADD COLUMN IF NOT EXISTS "linked_post_id" uuid;

-- Add foreign key constraint
ALTER TABLE "public"."posts" 
ADD CONSTRAINT "posts_linked_post_id_fkey" 
FOREIGN KEY ("linked_post_id") 
REFERENCES "public"."posts"("id") 
ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS "idx_posts_linked_post_id" 
ON "public"."posts" ("linked_post_id");

-- Comment describing the column
COMMENT ON COLUMN "public"."posts"."linked_post_id" IS 'ID of the translated version of this post (e.g., Vietnamese post links to English post and vice versa)';
