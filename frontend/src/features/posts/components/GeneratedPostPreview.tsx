type PreviewCommit = {
  sha: string
  shortSha?: string
  message: string
}

const SHORT_SHA_LENGTH = 7
const DEFAULT_GENERATION_MODE = 'preview'
const FALLBACK_REASON_LABELS = {
  missing_api_key: 'OpenAI key is missing.',
  request_failed: 'OpenAI request failed.',
  empty_response: 'OpenAI returned an empty response.',
  invalid_json: 'OpenAI returned invalid JSON.',
  invalid_draft: 'OpenAI returned an incomplete draft.',
} as const

type GeneratedPostPreviewProps = {
  post: {
    title: string
    summary?: string | null
    body: string
    sourceCommits: PreviewCommit[]
    generationMode?: 'openai' | 'fallback'
    fallbackReason?: keyof typeof FALLBACK_REASON_LABELS
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
      {post.generationMode === 'fallback' && post.fallbackReason ? (
        <p className="preview-fallback-note">
          {FALLBACK_REASON_LABELS[post.fallbackReason]}
        </p>
      ) : null}
      <span className="section-kicker">Preview</span>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <ul className="stack-list compact-list">
        {post.sourceCommits.map((commit) => (
          <li key={commit.sha} className="stack-card stack-card--compact">
            <div className="stack-card__row">
              <span className="stack-card__title">{commit.message}</span>
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
