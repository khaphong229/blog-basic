-- Atomic view count increment function
-- Prevents race conditions when multiple users view the same post simultaneously
-- Usage: SELECT increment_view_count('post-uuid-here');

CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon;
