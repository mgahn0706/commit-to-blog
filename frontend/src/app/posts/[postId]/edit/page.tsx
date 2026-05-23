import { parseEditPostPath } from '@/app/routes'
import { PostEditor } from '@/features/posts/components/PostEditor'
import { useEditPost } from '@/features/posts/use-edit-post'

type EditPostPageProps = {
  postId?: string
  navigate?: (path: string) => void
}

const EMPTY_POST_ID = ''
const MISSING_DRAFT_MESSAGE = 'No draft found.'

export function EditPostPage({ postId, navigate }: EditPostPageProps) {
  const resolvedPostId =
    postId ?? parseEditPostPath(window.location.pathname)?.postId ?? EMPTY_POST_ID
  const {
    post,
    message,
    isSaving,
    isPublishing,
    applyLocalChanges,
    savePost,
    publishPost,
  } = useEditPost(resolvedPostId, navigate)

  if (!resolvedPostId) {
    return <section className="feature-panel">{MISSING_DRAFT_MESSAGE}</section>
  }

  if (!post) {
    return <section className="feature-panel">{message}</section>
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
