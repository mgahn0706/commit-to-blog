import { useEffect, useState } from 'react'
import { buildBlogListPath, parseEditPostPath } from '@/app/routes'
import { markPostAsPublished, updatePostDraft } from '@/features/posts/mutations'
import { PostEditor } from '@/features/posts/components/PostEditor'
import { postsQueries } from '@/features/posts/queries'
import type { SavedPost } from '@/features/posts/types'
import { getErrorMessage } from '@/lib/get-error-message'

type EditPostPageProps = {
  postId?: string
  navigate?: (path: string) => void
}

const EMPTY_POST_ID = ''
const MISSING_DRAFT_MESSAGE = 'No draft found.'
const LOAD_POST_ERROR_MESSAGE = 'Failed to load post.'
const SAVE_POST_ERROR_MESSAGE = 'Failed to save draft.'
const PUBLISH_POST_ERROR_MESSAGE = 'Failed to publish post.'
const DRAFT_UPDATED_MESSAGE = 'Draft updated.'

export function EditPostPage({ postId, navigate }: EditPostPageProps) {
  const resolvedPostId =
    postId ?? parseEditPostPath(window.location.pathname)?.postId ?? EMPTY_POST_ID
  const [post, setPost] = useState<SavedPost | null>(null)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (!resolvedPostId) {
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
          setMessage(getErrorMessage(error, LOAD_POST_ERROR_MESSAGE))
        }
      }
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [resolvedPostId])

  if (!resolvedPostId) {
    return <section className="feature-panel">{MISSING_DRAFT_MESSAGE}</section>
  }

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

  if (!post) {
    return <section className="feature-panel">{message || MISSING_DRAFT_MESSAGE}</section>
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
