import { useCallback, useState } from 'react'

const MAX_SELECTED_COMMITS = 5

export function useCommitSelection() {
  const [selectedCommitShas, setSelectedCommitShas] = useState<string[]>([])

  const toggleCommitSelection = useCallback((sha: string) => {
    setSelectedCommitShas((current) => {
      if (current.includes(sha)) {
        return current.filter((item) => item !== sha)
      }

      if (current.length >= MAX_SELECTED_COMMITS) {
        return current
      }

      return [...current, sha]
    })
  }, [])

  const clearCommitSelection = useCallback(() => {
    setSelectedCommitShas([])
  }, [])

  return {
    selectedCommitShas,
    maxSelectedCommits: MAX_SELECTED_COMMITS,
    toggleCommitSelection,
    clearCommitSelection,
  }
}
