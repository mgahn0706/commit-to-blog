import { useCallback, useState } from 'react'
import { aiMutations } from '@/features/ai/mutations'
import type { GenerateDraftResult } from '@/features/ai/types'
import { getErrorMessage } from '@/lib/get-error-message'

const EMPTY_SELECTION_COUNT = 0
const DRAFT_ERROR_MESSAGE = 'Failed to generate draft.'

type GenerateDraftInput = {
  repositoryId: string
  branchName: string
  commitShas: string[]
}

export function useDraftGeneration(
  onGenerateSuccess: (draft: GenerateDraftResult) => void,
) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateDraft = useCallback(async (input: GenerateDraftInput) => {
    if (
      !input.repositoryId ||
      !input.branchName ||
      input.commitShas.length === EMPTY_SELECTION_COUNT
    ) {
      return
    }

    setIsGenerating(true)
    setErrorMessage('')

    try {
      const nextDraft = await aiMutations.generateDraft({
        repositoryId: input.repositoryId,
        branchName: input.branchName,
        commitShas: input.commitShas,
      })
      onGenerateSuccess(nextDraft)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, DRAFT_ERROR_MESSAGE))
    } finally {
      setIsGenerating(false)
    }
  }, [onGenerateSuccess])

  const clearErrorMessage = useCallback(() => {
    setErrorMessage('')
  }, [])

  return {
    isGenerating,
    errorMessage,
    generateDraft,
    clearErrorMessage,
    emptySelectionCount: EMPTY_SELECTION_COUNT,
  }
}
