import { supabase } from "@/lib/supabase"
import type { Comment, CommentInsert, CommentStatus } from "@/lib/supabase"

/**
 * Get comments for a post
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .eq("status", "visible")
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data as Comment[]) || []
}

/**
 * Add a comment to a post
 */
export async function addComment(comment: CommentInsert): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert(comment as never)
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

/**
 * Get all comments (for admin)
 */
export async function getAllComments(): Promise<(Comment & { post_title?: string })[]> {
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!comments || comments.length === 0) return []

  // Get unique post IDs
  const postIds = [...new Set((comments as Comment[]).map((c) => c.post_id))]

  // Fetch post titles
  const { data: posts } = await supabase.from("posts").select("id, title").in("id", postIds)

  const postTitleMap = new Map<string, string>()
  if (posts) {
    for (const post of posts as { id: string; title: string }[]) {
      postTitleMap.set(post.id, post.title)
    }
  }

  return (comments as Comment[]).map((comment) => ({
    ...comment,
    post_title: postTitleMap.get(comment.post_id),
  }))
}

/**
 * Update comment status (hide/show)
 */
export async function updateCommentStatus(id: string, status: CommentStatus): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .update({ status } as never)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", id)
  if (error) throw error
}

/**
 * Get comment count for a post
 */
export async function getCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("status", "visible")

  if (error) throw error
  return count || 0
}
