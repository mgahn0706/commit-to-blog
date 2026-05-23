import type { SavedPost } from './types'
import { publishSavedPost, updateSavedPost } from './api'

export async function updatePostDraft(
  post: SavedPost,
  updates: Partial<Pick<SavedPost, 'title' | 'summary' | 'body'>>,
): Promise<SavedPost> {
  return updateSavedPost(post.id, {
    ...updates,
    summary: updates.summary ?? undefined,
  })
}

export async function markPostAsPublished(post: SavedPost): Promise<SavedPost> {
  return publishSavedPost(post.id)
}
