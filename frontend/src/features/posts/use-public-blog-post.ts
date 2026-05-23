import { useEffect, useState } from 'react'
import { fetchPublicBlogPost } from './api'
import type { PublicBlogPostDetail } from './types'
import { getErrorMessage } from '@/lib/get-error-message'

const LOAD_POST_ERROR_MESSAGE = 'Failed to load blog post.'

export function usePublicBlogPost(username: string, postId: string) {
  const [post, setPost] = useState<PublicBlogPostDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!username || !postId) {
      return
    }

    let cancelled = false

    async function loadPost() {
      try {
        const nextPost = await fetchPublicBlogPost(username, postId)

        if (!cancelled) {
          setPost(nextPost)
          setErrorMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, LOAD_POST_ERROR_MESSAGE))
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [postId, username])

  return {
    post,
    errorMessage,
  }
}
