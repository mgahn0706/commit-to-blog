import { apiRequest } from '@/lib/api'
import type {
  PublicBlogPostDetail,
  PublicBlogPostListItem,
  SavedPost,
  SavedPostCard,
} from './types'

export function fetchSavedPosts(): Promise<SavedPostCard[]> {
  return apiRequest('/posts?status=all')
}

export function fetchSavedPost(postId: string): Promise<SavedPost> {
  return apiRequest(`/posts/${postId}`)
}

export function createSavedPost(input: {
  repositoryId: string
  branchName: string
  commitShas: string[]
  title: string
  summary?: string
  body: string
  tags?: string[]
}): Promise<SavedPost> {
  return apiRequest('/posts', {
    method: 'POST',
    body: input,
  })
}

export function updateSavedPost(
  postId: string,
  updates: {
    title?: string
    summary?: string
    body?: string
  },
): Promise<SavedPost> {
  return apiRequest(`/posts/${postId}`, {
    method: 'PATCH',
    body: updates,
  })
}

export function publishSavedPost(postId: string): Promise<SavedPost> {
  return apiRequest(`/posts/${postId}/publish`, {
    method: 'POST',
  })
}

export function fetchPublicBlogPosts(
  username: string,
): Promise<PublicBlogPostListItem[]> {
  return apiRequest(`/blog/${username}`)
}

export function fetchPublicBlogPost(
  username: string,
  postId: string,
): Promise<PublicBlogPostDetail> {
  return apiRequest(`/blog/${username}/${postId}`)
}
