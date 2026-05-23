import type { SavedPostCard as SavedPostCardType } from '../types'

type SavedPostCardProps = {
  post: SavedPostCardType
  onEdit: (postId: string) => void
  onOpenBlog: (username: string, postId: string) => void
}

export function SavedPostCard({ post, onEdit, onOpenBlog }: SavedPostCardProps) {
  const sourceCommitLabel = post.sourceCommit
    ? post.sourceCommitCount > 1
      ? `${post.sourceCommit.message} +${post.sourceCommitCount - 1} more`
      : post.sourceCommit.message
    : 'No source commits'

  return (
    <article className="stack-card">
      <div className="stack-card__row">
        <strong>{post.title}</strong>
        <span className="status-pill">{post.status}</span>
      </div>
      <p>{post.summary || 'No summary yet.'}</p>
      <small>{sourceCommitLabel}</small>
      <div className="action-row">
        <button type="button" className="secondary-button" onClick={() => onEdit(post.id)}>
          Edit
        </button>
        {post.status === 'PUBLISHED' ? (
          <button
            type="button"
            className="secondary-button"
            onClick={() => onOpenBlog(post.username, post.id)}
          >
            View blog
          </button>
        ) : null}
      </div>
    </article>
  )
}
