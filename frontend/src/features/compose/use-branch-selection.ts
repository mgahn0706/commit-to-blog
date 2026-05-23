import { useEffect, useState } from 'react'
import { githubQueries } from '@/features/github/queries'
import type { GithubBranch } from '@/features/github/types'
import { getErrorMessage } from '@/lib/get-error-message'

const BRANCHES_ERROR_MESSAGE = 'Failed to load branches.'

export function useBranchSelection(selectedRepositoryId: string) {
  const [branches, setBranches] = useState<GithubBranch[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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

        const defaultBranch =
          branchItems.find((branch) => branch.isDefault)?.name ??
          branchItems[0]?.name ??
          ''

        setBranches(branchItems)
        setSelectedBranch(defaultBranch)
        setErrorMessage('')
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

  return {
    branches: selectedRepositoryId ? branches : [],
    selectedBranch: selectedRepositoryId ? selectedBranch : '',
    setSelectedBranch,
    errorMessage,
  }
}
