type PreviewCommit = {
  sha: string
  shortSha?: string
  message: string
}

const SHORT_SHA_LENGTH = 7
const DEFAULT_GENERATION_MODE = 'preview'

type GeneratedPostPreviewProps = {
  post: {
    title: string
    summary?: string | null
    body: string
    sourceCommits: PreviewCommit[]
    generationMode?: 'openai' | 'fallback'
  }
  onSave?: () => void
  onRegenerate?: () => void
  isSaving?: boolean
  saveLabel?: string
}

export function GeneratedPostPreview({
  post,
  onSave,
  onRegenerate,
  isSaving,
  saveLabel,
}: GeneratedPostPreviewProps) {
  return (
    <article className="workspace-card preview-panel">
      <div className="feature-panel__meta">
        <span className="status-pill">
          {post.generationMode ?? DEFAULT_GENERATION_MODE}
        </span>
        <span>{post.sourceCommits.length} source commit(s)</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <ul className="stack-list compact-list">
        {post.sourceCommits.map((commit) => (
          <li key={commit.sha} className="stack-card stack-card--compact">
            <div className="stack-card__row">
              <strong>{commit.message}</strong>
              <code>{commit.shortSha ?? commit.sha.slice(0, SHORT_SHA_LENGTH)}</code>
            </div>
          </li>
        ))}
      </ul>
      <div className="preview-body">
        <p>{post.body}</p>
      </div>
      <div className="action-row">
        <button
          type="button"
          className="primary-button"
          onClick={onSave}
          disabled={!onSave || isSaving}
        >
          {isSaving ? 'Saving...' : saveLabel ?? 'Save to Saved Posts'}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onRegenerate}
          disabled={!onRegenerate}
        >
          Regenerate
        </button>
      </div>
    </article>
  )
}
