import { useEffect, useState } from 'react'
import { fetchPublicBlogPosts } from './api'
import type { PublicBlogPostListItem } from './types'
import { getErrorMessage } from '@/lib/get-error-message'

const BLOG_POSTS_ERROR_MESSAGE = 'Failed to load blog posts.'

export function usePublicBlogPosts(username: string) {
  const [posts, setPosts] = useState<PublicBlogPostListItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPosts() {
      try {
        const nextPosts = await fetchPublicBlogPosts(username)

        if (!cancelled) {
          setPosts(nextPosts)
          setErrorMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, BLOG_POSTS_ERROR_MESSAGE))
        }
      }
    }

    void loadPosts()

    return () => {
      cancelled = true
    }
  }, [username])

  return {
    posts,
    errorMessage,
  }
}
