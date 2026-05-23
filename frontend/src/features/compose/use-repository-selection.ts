import { useEffect, useState } from 'react'
import { githubQueries } from '@/features/github/queries'
import type { GithubRepository } from '@/features/github/types'
import { getErrorMessage } from '@/lib/get-error-message'

const REPOSITORIES_ERROR_MESSAGE = 'Failed to load repositories.'

export function useRepositorySelection() {
  const [repositories, setRepositories] = useState<GithubRepository[]>([])
  const [selectedRepositoryId, setSelectedRepositoryId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadRepositories() {
      try {
        const repositoryItems = await githubQueries.repositories()

        if (cancelled) {
          return
        }

        setRepositories(repositoryItems)
        setSelectedRepositoryId((current) => current || repositoryItems[0]?.id || '')
        setErrorMessage('')
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

  return {
    repositories,
    selectedRepositoryId,
    setSelectedRepositoryId,
    errorMessage,
  }
}
