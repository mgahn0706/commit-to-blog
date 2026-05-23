import { useEffect, useState } from 'react'
import { postsQueries } from './queries'
import type { SavedPostCard } from './types'
import { getErrorMessage } from '@/lib/get-error-message'

const SAVED_POSTS_ERROR_MESSAGE = 'Failed to load saved posts.'

export function useSavedPosts() {
  const [posts, setPosts] = useState<SavedPostCard[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPosts() {
      try {
        const nextPosts = await postsQueries.all()

        if (!cancelled) {
          setPosts(nextPosts)
          setErrorMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, SAVED_POSTS_ERROR_MESSAGE))
        }
      }
    }

    void loadPosts()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    posts,
    errorMessage,
  }
}
