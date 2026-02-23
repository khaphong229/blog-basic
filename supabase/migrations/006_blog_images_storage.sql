-- Create storage bucket for blog images
-- Run this in Supabase SQL Editor or use Supabase Dashboard → Storage → New Bucket

-- Note: Supabase Storage buckets are typically created via Dashboard or API.
-- This migration documents the required configuration:
--
-- Bucket name: blog-images
-- Public: true (images served via CDN)
-- File size limit: 5MB (5242880 bytes)
-- Allowed MIME types: image/jpeg, image/png, image/webp
--
-- RLS Policies for storage.objects (bucket_id = 'blog-images'):

-- Allow anyone to read (public blog images)
CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Only authenticated users can update their uploads
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');
