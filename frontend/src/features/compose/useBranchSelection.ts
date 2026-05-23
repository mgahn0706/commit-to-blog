import { useEffect, useState } from 'react'
import { githubQueries } from '@/features/github/queries'
import type { GithubBranch } from '@/features/github/types'
import { getErrorMessage } from '@/lib/get-error-message'

const BRANCHES_ERROR_MESSAGE = 'Failed to load branches.'

export function useBranchSelection(selectedRepositoryId: string) {
  const [branches, setBranches] = useState<GithubBranch[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const [loadedRepositoryId, setLoadedRepositoryId] = useState('')
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
        setLoadedRepositoryId(selectedRepositoryId)
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

  const hasLoadedSelectedRepository = loadedRepositoryId === selectedRepositoryId

  return {
    branches: hasLoadedSelectedRepository ? branches : [],
    selectedBranch: hasLoadedSelectedRepository ? selectedBranch : '',
    setSelectedBranch,
    errorMessage,
  }
}
