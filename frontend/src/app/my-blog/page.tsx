import { useEffect, useState } from 'react'
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
import { createSavedPost } from '@/features/posts/api'
import { GeneratedPostPreview } from '@/features/posts/components/GeneratedPostPreview'

type MyBlogPageProps = {
  navigate?: (path: string) => void
}

const MAX_SELECTED_COMMITS = 5

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
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Failed to load repositories.',
          )
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
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load branches.',
          )
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
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load commits.',
          )
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
    if (!selectedRepositoryId || !selectedBranch || selectedCommitShas.length === 0) {
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
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to generate draft.',
      )
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
      navigate?.('/saved-posts')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save draft.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="feature-layout">
      <div className="feature-panel">
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
        <p className="feature-note">
          Select a repository, branch, and up to {MAX_SELECTED_COMMITS} commits,
          then generate and save a draft.
        </p>
        <div className="action-row">
          <button
            type="button"
            className="primary-button"
            onClick={() => void generateDraft()}
            disabled={isGenerating || selectedCommitShas.length === 0}
          >
            {isGenerating ? 'Generating...' : 'Generate draft'}
          </button>
          <span>{selectedCommitShas.length} commit(s) selected</span>
        </div>
      </div>
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}
      <CommitList
        commits={commits}
        selectedCommitShas={selectedCommitShas}
        onToggleCommit={toggleCommitSelection}
      />
      {draft ? (
        <GeneratedPostPreview
          post={draft}
          onSave={() => void saveDraft()}
          onRegenerate={() => void generateDraft()}
          isSaving={isSaving}
        />
      ) : null}
    </section>
  )
}

export default MyBlogPage
