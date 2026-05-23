import { useEffect, useState } from 'react'
import { aiMutations } from '@/features/ai/mutations'
import type { GenerateDraftResult } from '@/features/ai/types'
import { githubQueries } from '@/features/github/queries'
import type {
  GithubBranch,
  GithubCommit,
  GithubRepository,
} from '@/features/github/types'
import { createSavedPost } from '@/features/posts/api'
import { getErrorMessage } from '@/lib/get-error-message'

const MAX_SELECTED_COMMITS = 5
const EMPTY_SELECTION_COUNT = 0
const REPOSITORIES_ERROR_MESSAGE = 'Failed to load repositories.'
const BRANCHES_ERROR_MESSAGE = 'Failed to load branches.'
const COMMITS_ERROR_MESSAGE = 'Failed to load commits.'
const DRAFT_ERROR_MESSAGE = 'Failed to generate draft.'
const SAVE_DRAFT_ERROR_MESSAGE = 'Failed to save draft.'

export function useComposeWorkspace(onSaveSuccess?: () => void) {
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
      onSaveSuccess?.()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, SAVE_DRAFT_ERROR_MESSAGE))
    } finally {
      setIsSaving(false)
    }
  }

  return {
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
    maxSelectedCommits: MAX_SELECTED_COMMITS,
    emptySelectionCount: EMPTY_SELECTION_COUNT,
    setSelectedRepositoryId,
    setSelectedBranch,
    toggleCommitSelection,
    generateDraft,
    saveDraft,
  }
}
