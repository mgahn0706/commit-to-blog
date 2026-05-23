type PreviewCommit = {
  sha: string
  shortSha?: string
  message: string
}

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
}

export function GeneratedPostPreview({
  post,
  onSave,
  onRegenerate,
  isSaving,
}: GeneratedPostPreviewProps) {
  return (
    <article className="feature-panel">
      <div className="feature-panel__meta">
        <span className="status-pill">{post.generationMode ?? 'preview'}</span>
        <span>{post.sourceCommits.length} source commit(s)</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <ul className="stack-list compact-list">
        {post.sourceCommits.map((commit) => (
          <li key={commit.sha} className="stack-card stack-card--compact">
            <div className="stack-card__row">
              <strong>{commit.message}</strong>
              <code>{commit.shortSha ?? commit.sha.slice(0, 7)}</code>
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
          {isSaving ? 'Saving...' : 'Save to Saved Posts'}
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
