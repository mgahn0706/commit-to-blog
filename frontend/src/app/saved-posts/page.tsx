import { useEffect, useState } from 'react'
import { buildBlogPostPath, buildEditPostPath } from '@/app/routes'
import { SavedPostCard } from '@/features/posts/components/SavedPostCard'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPostCard as SavedPostCardType } from '@/features/posts/types'
import { getErrorMessage } from '@/lib/get-error-message'

type SavedPostsPageProps = {
  navigate?: (path: string) => void
}

const SAVED_POSTS_ERROR_MESSAGE = 'Failed to load saved posts.'

export function SavedPostsPage({ navigate }: SavedPostsPageProps) {
  const [posts, setPosts] = useState<SavedPostCardType[]>([])
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

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>Saved posts</h2>
        <p>Drafts and published posts are both visible from one feature slice.</p>
      </div>
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
      <div className="feature-stack">
        {posts.map((post) => (
          <SavedPostCard
            key={post.id}
            post={post}
            onEdit={(postId) => navigate?.(buildEditPostPath(postId))}
            onOpenBlog={(username, postId) =>
              navigate?.(buildBlogPostPath(username, postId))
            }
          />
        ))}
      </div>
    </section>
  )
}

export default SavedPostsPage
