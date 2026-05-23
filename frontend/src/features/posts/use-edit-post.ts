import { useEffect, useState } from 'react'
import { buildBlogListPath } from '@/app/routes'
import { markPostAsPublished, updatePostDraft } from './mutations'
import { postsQueries } from './queries'
import type { SavedPost } from './types'
import { getErrorMessage } from '@/lib/get-error-message'

const MISSING_DRAFT_MESSAGE = 'No draft found.'
const LOAD_POST_ERROR_MESSAGE = 'Failed to load post.'
const SAVE_POST_ERROR_MESSAGE = 'Failed to save draft.'
const PUBLISH_POST_ERROR_MESSAGE = 'Failed to publish post.'
const DRAFT_UPDATED_MESSAGE = 'Draft updated.'

export function useEditPost(
  postId: string,
  navigate?: (path: string) => void,
) {
  const [post, setPost] = useState<SavedPost | null>(null)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (!postId) {
      return
    }

    let cancelled = false

    async function loadPost() {
      try {
        const nextPost = await postsQueries.byId(postId)

        if (!cancelled) {
          setPost(nextPost)
          setMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(getErrorMessage(error, LOAD_POST_ERROR_MESSAGE))
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [postId])

  function applyLocalChanges(
    updates: Partial<Pick<SavedPost, 'title' | 'summary' | 'body'>>,
  ) {
    setPost((current) => (current ? { ...current, ...updates } : current))
  }

  async function savePost() {
    if (!post) {
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const updatedPost = await updatePostDraft(post, {
        title: post.title,
        summary: post.summary ?? undefined,
        body: post.body,
      })
      setPost(updatedPost)
      setMessage(DRAFT_UPDATED_MESSAGE)
    } catch (error) {
      setMessage(getErrorMessage(error, SAVE_POST_ERROR_MESSAGE))
    } finally {
      setIsSaving(false)
    }
  }

  async function publishPost() {
    if (!post) {
      return
    }

    setIsPublishing(true)
    setMessage('')

    try {
      const publishedPost = await markPostAsPublished(post)
      setPost(publishedPost)
      navigate?.(buildBlogListPath(publishedPost.username))
    } catch (error) {
      setMessage(getErrorMessage(error, PUBLISH_POST_ERROR_MESSAGE))
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    post,
    message: message || MISSING_DRAFT_MESSAGE,
    isSaving,
    isPublishing,
    applyLocalChanges,
    savePost,
    publishPost,
  }
}
