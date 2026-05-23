import { useEffect, useState } from 'react'
import { SavedPostCard } from '@/features/posts/components/SavedPostCard'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPostCard as SavedPostCardType } from '@/features/posts/types'

type SavedPostsPageProps = {
  navigate?: (path: string) => void
}

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
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load saved posts.',
          )
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
            onEdit={(postId) => navigate?.(`/posts/${postId}/edit`)}
            onOpenBlog={(username, postId) => navigate?.(`/blog/${username}/${postId}`)}
          />
        ))}
      </div>
    </section>
  )
}

export default SavedPostsPage
