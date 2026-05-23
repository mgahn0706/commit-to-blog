import { useEffect, useState } from 'react'
import { fetchPublicBlogPost } from '@/features/posts/api'
import type { PublicBlogPostDetail } from '@/features/posts/types'

type BlogPostPageProps = {
  username?: string
  postId?: string
}

function readRouteParams(pathname: string) {
  const match = pathname.match(/^\/blog\/([^/]+)\/([^/]+)$/)

  if (!match) {
    return null
  }

  return {
    username: match[1],
    postId: match[2],
  }
}

export function BlogPostPage({ username, postId }: BlogPostPageProps) {
  const routeParams = readRouteParams(window.location.pathname)
  const resolvedUsername = username ?? routeParams?.username ?? ''
  const resolvedPostId = postId ?? routeParams?.postId ?? ''
  const [post, setPost] = useState<PublicBlogPostDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!resolvedUsername || !resolvedPostId) {
      setErrorMessage('No published post found.')
      return
    }

    let cancelled = false

    async function loadPost() {
      try {
        const nextPost = await fetchPublicBlogPost(resolvedUsername, resolvedPostId)

        if (!cancelled) {
          setPost(nextPost)
          setErrorMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load blog post.',
          )
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [resolvedPostId, resolvedUsername])

  if (!post) {
    return <section className="feature-panel">{errorMessage || 'No published post found.'}</section>
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>
          {post.username}/{post.id}
        </h2>
        <p>Published posts are rendered from the public blog API.</p>
      </div>
      <article className="feature-panel">
        <h3>{post.title}</h3>
        <p>{post.summary || 'No summary yet.'}</p>
        <div className="preview-body">
          <p>{post.body}</p>
        </div>
      </article>
    </section>
  )
}

export default BlogPostPage
