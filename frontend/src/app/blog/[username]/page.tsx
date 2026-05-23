import { useEffect, useState } from 'react'
import { buildBlogPostPath } from '@/app/routes'
import { fetchPublicBlogPosts } from '@/features/posts/api'
import type { PublicBlogPostListItem } from '@/features/posts/types'
import { getErrorMessage } from '@/lib/get-error-message'

type BlogIndexPageProps = {
  username: string
  navigate: (path: string) => void
}

const BLOG_POSTS_ERROR_MESSAGE = 'Failed to load blog posts.'

export function BlogIndexPage({ username, navigate }: BlogIndexPageProps) {
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

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>{username}&rsquo;s internal blog</h2>
        <p>Published posts are visible here after a draft is promoted.</p>
      </div>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <div className="feature-stack">
        {posts.map((post) => (
          <article key={post.id} className="stack-card">
            <div className="stack-card__row">
              <strong>{post.title}</strong>
              <span>{new Date(post.publishedAt).toLocaleString()}</span>
            </div>
            <p>{post.summary || 'No summary yet.'}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(buildBlogPostPath(username, post.id))}
            >
              Open post
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogIndexPage
