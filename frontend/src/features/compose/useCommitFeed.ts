import { useEffect, useState } from 'react'
import { githubQueries } from '@/features/github/queries'
import type { GithubCommit } from '@/features/github/types'
import { getErrorMessage } from '@/lib/get-error-message'

const COMMITS_ERROR_MESSAGE = 'Failed to load commits.'

export function useCommitFeed(
  selectedRepositoryId: string,
  selectedBranch: string,
) {
  const [commits, setCommits] = useState<GithubCommit[]>([])
  const [errorMessage, setErrorMessage] = useState('')

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
        setErrorMessage('')
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

  return {
    commits: selectedRepositoryId && selectedBranch ? commits : [],
    errorMessage,
  }
}
