import { buildSavedPostsPath } from '@/app/routes'
import { BranchSelector } from '@/features/github/components/BranchSelector'
import { CommitList } from '@/features/github/components/CommitList'
import { RepositorySelector } from '@/features/github/components/RepositorySelector'
import { useComposeWorkspace } from '@/features/compose/useComposeWorkspace'
import { GeneratedPostPreview } from '@/features/posts/components/GeneratedPostPreview'

type MyBlogPageProps = {
  navigate?: (path: string) => void
}

const CREATE_BUTTON_LABEL = 'Save to post queue'
const GENERATE_BUTTON_LABEL = 'Generate summary'

export function MyBlogPage({ navigate }: MyBlogPageProps) {
  const {
    repositories,
    branches,
    commits,
    selectedRepositoryId,
    selectedBranch,
    selectedCommitShas,
    draft,
    errorMessage,
    isGenerating,
    isSaving,
    maxSelectedCommits,
    emptySelectionCount,
    setSelectedRepositoryId,
    setSelectedBranch,
    toggleCommitSelection,
    generateDraft,
    saveDraft,
  } = useComposeWorkspace(() => navigate?.(buildSavedPostsPath()))

  return (
    <section className="workspace-layout">
      <div className="workspace-sidebar">
        <div className="section-header">
          <div>
            <span className="section-kicker">Compose</span>
            <h1>Choose the commits that deserve a post.</h1>
            <p>
              Start with one repository and one branch. Then pick the changes that
              tell a coherent story before asking AI to draft it.
            </p>
          </div>
        </div>

        <div className="workspace-card">
          <div className="field-grid">
            <RepositorySelector
              repositories={repositories}
              value={selectedRepositoryId}
              onChange={setSelectedRepositoryId}
            />
            <BranchSelector
              branches={branches}
              value={selectedBranch}
              onChange={setSelectedBranch}
            />
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-card__title">
            <div>
              <span className="section-kicker">Source Timeline</span>
              <h3>Recent commits</h3>
            </div>
            <span className="counter">{selectedCommitShas.length}/{maxSelectedCommits}</span>
          </div>
          <CommitList
            commits={commits}
            selectedCommitShas={selectedCommitShas}
            onToggleCommit={toggleCommitSelection}
          />
        </div>
      </div>

      <div className="workspace-main">
        <div className="workspace-card workspace-card--hero">
          <div className="workspace-card__title">
            <div>
              <span className="section-kicker">Draft Setup</span>
              <h2>Generate a readable summary from the selected changes.</h2>
              <p>
                {selectedCommitShas.length === emptySelectionCount
                  ? 'Choose one or more commits first. The preview will stay empty until the source set is clear.'
                  : `${selectedCommitShas.length} commit(s) are queued. Generate once the selection reads like one story.`}
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => void generateDraft()}
              disabled={isGenerating || selectedCommitShas.length === emptySelectionCount}
            >
              {isGenerating ? 'Generating...' : GENERATE_BUTTON_LABEL}
            </button>
          </div>
          {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
        </div>

        {draft ? (
          <GeneratedPostPreview
            post={draft}
            onSave={() => void saveDraft()}
            onRegenerate={() => void generateDraft()}
            isSaving={isSaving}
            saveLabel={CREATE_BUTTON_LABEL}
          />
        ) : (
          <div className="workspace-card workspace-card--empty">
            <div className="empty-illustration">AI</div>
            <h3>Draft preview appears here</h3>
            <p>
              After generation, this area will show the proposed title, summary, body,
              and the commits that shaped the draft.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyBlogPage
