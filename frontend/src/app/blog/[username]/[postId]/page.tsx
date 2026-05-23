import { useEffect, useState } from 'react'
import { parseBlogPostPath } from '@/app/routes'
import { fetchPublicBlogPost } from '@/features/posts/api'
import type { PublicBlogPostDetail } from '@/features/posts/types'
import { getErrorMessage } from '@/lib/get-error-message'

type BlogPostPageProps = {
  username?: string
  postId?: string
}

const MISSING_POST_MESSAGE = 'No published post found.'
const LOAD_POST_ERROR_MESSAGE = 'Failed to load blog post.'

export function BlogPostPage({ username, postId }: BlogPostPageProps) {
  const routeParams = parseBlogPostPath(window.location.pathname)
  const resolvedUsername = username ?? routeParams?.username ?? ''
  const resolvedPostId = postId ?? routeParams?.postId ?? ''
  const [post, setPost] = useState<PublicBlogPostDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!resolvedUsername || !resolvedPostId) {
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
          setErrorMessage(getErrorMessage(error, LOAD_POST_ERROR_MESSAGE))
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [resolvedPostId, resolvedUsername])

  if (!resolvedUsername || !resolvedPostId) {
    return <section className="feature-panel">{MISSING_POST_MESSAGE}</section>
  }

  if (!post) {
    return <section className="feature-panel">{errorMessage || MISSING_POST_MESSAGE}</section>
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
