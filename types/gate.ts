/**
 * Types for the Gated Download System
 *
 * @remarks
 * This module defines TypeScript interfaces for the gated download feature:
 * - PostResource: downloadable resources attached to a blog post
 * - GateStep: individual unlock requirements (visit URL, etc.)
 * - GateStatus: computed unlock state for a session
 *
 * Also exports Supabase Row types (snake_case) for direct DB mapping.
 */

// ===========================================
// Application Types (camelCase)
// ===========================================

export interface PostResource {
  id: string
  postId: string
  title: string
  type: "upload" | "external"
  filePath: string | null
  fileName: string | null
  fileSize: number | null
  externalUrl: string | null
  sortOrder: number
  downloadCount: number
  gateSteps: GateStep[]
  createdAt: string
}

export interface GateStep {
  id: string
  resourceId: string
  label: string
  url: string
  sortOrder: number
}

export interface GateStatus {
  unlockedResourceIds: string[]
  completedStepIds: string[]
}

export interface GateStatusResponse {
  status: GateStatus
}

// ===========================================
// Supabase Row Types (snake_case)
// ===========================================

export interface PostResourceRow {
  id: string
  post_id: string
  title: string
  type: "upload" | "external"
  file_path: string | null
  file_name: string | null
  file_size: number | null
  external_url: string | null
  sort_order: number
  download_count: number
  created_at: string
}

export interface GateStepRow {
  id: string
  resource_id: string
  label: string
  url: string
  sort_order: number
  created_at: string
}

export interface GateCompletionRow {
  id: string
  step_id: string
  session_id: string
  completed_at: string
}
