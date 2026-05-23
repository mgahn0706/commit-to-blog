import { useEffect, useState } from 'react'
import { markPostAsPublished, updatePostDraft } from '@/features/posts/mutations'
import { PostEditor } from '@/features/posts/components/PostEditor'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPost } from '@/features/posts/types'

type EditPostPageProps = {
  postId?: string
  navigate?: (path: string) => void
}

function readRoutePostId(pathname: string) {
  const match = pathname.match(/^\/posts\/([^/]+)\/edit$/)
  return match?.[1] ?? ''
}

export function EditPostPage({ postId, navigate }: EditPostPageProps) {
  const resolvedPostId = postId ?? readRoutePostId(window.location.pathname)
  const [post, setPost] = useState<SavedPost | null>(null)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (!resolvedPostId) {
      setMessage('No draft found.')
      return
    }

    let cancelled = false

    async function loadPost() {
      try {
        const nextPost = await postsQueries.byId(resolvedPostId)

        if (!cancelled) {
          setPost(nextPost)
          setMessage('')
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : 'Failed to load post.')
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [resolvedPostId])

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
      setMessage('Draft updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save draft.')
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
      navigate?.(`/blog/${publishedPost.username}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to publish post.')
    } finally {
      setIsPublishing(false)
    }
  }

  if (!post) {
    return <section className="feature-panel">{message || 'No draft found.'}</section>
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
        <h2>Edit post</h2>
        <p>Refine the generated draft, then publish it to the internal blog.</p>
      </div>
      <PostEditor
        post={post}
        onChange={applyLocalChanges}
        onSave={() => void savePost()}
        onPublish={() => void publishPost()}
        isSaving={isSaving}
        isPublishing={isPublishing}
        message={message}
      />
    </section>
  )
}

export default EditPostPage
