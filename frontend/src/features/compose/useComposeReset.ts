import { useEffect } from 'react'

type UseComposeResetInput = {
  selectedRepositoryId: string
  selectedBranch: string
  clearCommitSelection: () => void
  clearDraft: () => void
  clearDraftGenerationErrorMessage: () => void
  clearDraftSaveErrorMessage: () => void
}

export function useComposeReset({
  selectedRepositoryId,
  selectedBranch,
  clearCommitSelection,
  clearDraft,
  clearDraftGenerationErrorMessage,
  clearDraftSaveErrorMessage,
}: UseComposeResetInput) {
  useEffect(() => {
    if (!selectedRepositoryId) {
      return
    }

    clearCommitSelection()
    clearDraft()
    clearDraftGenerationErrorMessage()
    clearDraftSaveErrorMessage()
  }, [
    selectedRepositoryId,
    selectedBranch,
    clearCommitSelection,
    clearDraft,
    clearDraftGenerationErrorMessage,
    clearDraftSaveErrorMessage,
  ])
}
