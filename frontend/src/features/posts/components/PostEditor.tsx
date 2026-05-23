import type { SavedPost } from '../types'

type PostEditorProps = {
  post: SavedPost
  onChange?: (updates: Partial<Pick<SavedPost, 'title' | 'summary' | 'body'>>) => void
  onSave?: () => void
  onPublish?: () => void
  isSaving?: boolean
  isPublishing?: boolean
  message?: string
}

export function PostEditor({
  post,
  onChange,
  onSave,
  onPublish,
  isSaving,
  isPublishing,
  message,
}: PostEditorProps) {
  return (
    <section className="feature-panel">
      <div className="editor-grid">
        <label className="feature-field">
          <span>Title</span>
          <input
            value={post.title}
            onChange={(event) => onChange?.({ title: event.target.value })}
          />
        </label>
        <label className="feature-field">
          <span>Summary</span>
          <textarea
            value={post.summary ?? ''}
            onChange={(event) => onChange?.({ summary: event.target.value })}
            rows={3}
          />
        </label>
        <label className="feature-field">
          <span>Body</span>
          <textarea
            value={post.body}
            onChange={(event) => onChange?.({ body: event.target.value })}
            rows={10}
          />
        </label>
      </div>
      <div className="action-row">
        <button
          type="button"
          className="primary-button"
          onClick={onSave}
          disabled={!onSave || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onPublish}
          disabled={!onPublish || isPublishing || !post.title.trim() || !post.body.trim()}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
      {message ? <p className="feature-note">{message}</p> : null}
    </section>
  )
}
