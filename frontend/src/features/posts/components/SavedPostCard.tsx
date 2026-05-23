import type { SavedPostCard as SavedPostCardType } from '../types'

type SavedPostCardProps = {
  post: SavedPostCardType
  onEdit: (postId: string) => void
  onOpenBlog: (username: string, postId: string) => void
}

const NO_SOURCE_COMMITS_LABEL = 'No source commits'
const NO_SUMMARY_LABEL = 'No summary yet.'
const ADDITIONAL_COMMITS_OFFSET = 1

export function SavedPostCard({ post, onEdit, onOpenBlog }: SavedPostCardProps) {
  const sourceCommitLabel = post.sourceCommit
    ? post.sourceCommitCount > 1
      ? `${post.sourceCommit.message} +${post.sourceCommitCount - ADDITIONAL_COMMITS_OFFSET} more`
      : post.sourceCommit.message
    : NO_SOURCE_COMMITS_LABEL

  return (
    <article className="saved-post-card">
      <div className="saved-post-card__meta">
        <span className="branch-chip">
          {post.sourceCommit?.sourceBranchName ?? 'draft'}
        </span>
        <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary || NO_SUMMARY_LABEL}</p>
      <small>{sourceCommitLabel}</small>
      <div className="saved-post-card__footer">
        <span className="status-pill">{post.status}</span>
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
      </div>
    </article>
  )
}
