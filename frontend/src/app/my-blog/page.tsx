import { useEffect, useState } from 'react'
import { buildSavedPostsPath } from '@/app/routes'
import { BranchSelector } from '@/features/github/components/BranchSelector'
import { CommitList } from '@/features/github/components/CommitList'
import { RepositorySelector } from '@/features/github/components/RepositorySelector'
import { aiMutations } from '@/features/ai/mutations'
import type { GenerateDraftResult } from '@/features/ai/types'
import { githubQueries } from '@/features/github/queries'
import type {
  GithubBranch,
  GithubCommit,
  GithubRepository,
} from '@/features/github/types'
import { getErrorMessage } from '@/lib/get-error-message'
import { createSavedPost } from '@/features/posts/api'
import { GeneratedPostPreview } from '@/features/posts/components/GeneratedPostPreview'

type MyBlogPageProps = {
  navigate?: (path: string) => void
}

const MAX_SELECTED_COMMITS = 5
const EMPTY_SELECTION_COUNT = 0
const REPOSITORIES_ERROR_MESSAGE = 'Failed to load repositories.'
const BRANCHES_ERROR_MESSAGE = 'Failed to load branches.'
const COMMITS_ERROR_MESSAGE = 'Failed to load commits.'
const DRAFT_ERROR_MESSAGE = 'Failed to generate draft.'
const SAVE_DRAFT_ERROR_MESSAGE = 'Failed to save draft.'
const CREATE_BUTTON_LABEL = 'Save to post queue'
const GENERATE_BUTTON_LABEL = 'Generate summary'

export function MyBlogPage({ navigate }: MyBlogPageProps) {
  const [repositories, setRepositories] = useState<GithubRepository[]>([])
  const [branches, setBranches] = useState<GithubBranch[]>([])
  const [commits, setCommits] = useState<GithubCommit[]>([])
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedCommitShas, setSelectedCommitShas] = useState<string[]>([])
  const [draft, setDraft] = useState<GenerateDraftResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadRepositories() {
      try {
        const repositoryItems = await githubQueries.repositories()

        if (cancelled) {
          return
        }

        setRepositories(repositoryItems)
        const initialRepository = repositoryItems[0]

        if (initialRepository) {
          setSelectedRepositoryId(initialRepository.id)
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, REPOSITORIES_ERROR_MESSAGE))
        }
      }
    }

    void loadRepositories()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedRepositoryId) {
      return
    }

    let cancelled = false

    async function loadBranches() {
      try {
        const branchItems = await githubQueries.branches(selectedRepositoryId)

        if (cancelled) {
          return
        }

        setBranches(branchItems)
        const defaultBranch =
          branchItems.find((branch) => branch.isDefault)?.name ??
          branchItems[0]?.name ??
          ''
        setSelectedBranch(defaultBranch)
        setSelectedCommitShas([])
        setDraft(null)
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, BRANCHES_ERROR_MESSAGE))
        }
      }
    }

    void loadBranches()

    return () => {
      cancelled = true
    }
  }, [selectedRepositoryId])

  useEffect(() => {
    if (!selectedRepositoryId || !selectedBranch) {
      return
    }

    let cancelled = false

    async function loadCommits() {
      try {
        const nextCommits = await githubQueries.commits(
          selectedRepositoryId,
          selectedBranch,
        )

        if (cancelled) {
          return
        }

        setCommits(nextCommits)
        setSelectedCommitShas([])
        setDraft(null)
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getErrorMessage(error, COMMITS_ERROR_MESSAGE))
        }
      }
    }

    void loadCommits()

    return () => {
      cancelled = true
    }
  }, [selectedRepositoryId, selectedBranch])

  function toggleCommitSelection(sha: string) {
    setSelectedCommitShas((current) => {
      if (current.includes(sha)) {
        return current.filter((item) => item !== sha)
      }

      if (current.length >= MAX_SELECTED_COMMITS) {
        return current
      }

      return [...current, sha]
    })
  }

  async function generateDraft() {
    if (
      !selectedRepositoryId ||
      !selectedBranch ||
      selectedCommitShas.length === EMPTY_SELECTION_COUNT
    ) {
      return
    }

    setIsGenerating(true)
    setErrorMessage('')

    try {
      const nextDraft = await aiMutations.generateDraft({
        repositoryId: selectedRepositoryId,
        branchName: selectedBranch,
        commitShas: selectedCommitShas,
      })
      setDraft(nextDraft)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, DRAFT_ERROR_MESSAGE))
    } finally {
      setIsGenerating(false)
    }
  }

  async function saveDraft() {
    if (!draft || !selectedRepositoryId || !selectedBranch) {
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      await createSavedPost({
        repositoryId: selectedRepositoryId,
        branchName: selectedBranch,
        commitShas: selectedCommitShas,
        title: draft.title,
        summary: draft.summary,
        body: draft.body,
        tags: draft.tags,
      })
      navigate?.(buildSavedPostsPath())
    } catch (error) {
      setErrorMessage(getErrorMessage(error, SAVE_DRAFT_ERROR_MESSAGE))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="workspace-layout">
      <div className="workspace-sidebar">
        <div className="section-header">
          <h2>Commit source</h2>
          <p>Pick a repository, branch, and the commits you want the AI to summarize.</p>
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
            <h3>Recent commits</h3>
            <span>{selectedCommitShas.length}/{MAX_SELECTED_COMMITS}</span>
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
              <h2>Selected commit</h2>
              <p>
                {selectedCommitShas.length === EMPTY_SELECTION_COUNT
                  ? 'Choose one or more commits to create an AI summary.'
                  : `${selectedCommitShas.length} commit(s) queued for summary generation.`}
              </p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => void generateDraft()}
              disabled={isGenerating || selectedCommitShas.length === EMPTY_SELECTION_COUNT}
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
            <h3>AI summary preview</h3>
            <p>
              After you select commits and generate a summary, the draft preview will appear
              here with source references and save actions.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyBlogPage
